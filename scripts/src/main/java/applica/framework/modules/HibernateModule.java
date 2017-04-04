package applica.framework.modules;

import applica.framework.AppContext;
import applica.framework.SystemUtils;
import applica.framework.annotations.Action;
import applica.framework.data.hibernate.annotations.IgnoreMapping;
import applica.framework.library.utils.FileWalker;
import applica.framework.library.utils.FileWalkerListener;
import applica.framework.library.utils.TypeUtils;
import applica.framework.library.utils.ClassHierarchy;
import applica.framework.modules.hibernate.Mapper;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;

import java.io.File;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Properties;
import java.util.stream.Collectors;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 01/10/14
 * Time: 19:02
 */

@applica.framework.annotations.Module("hibernate")
public class HibernateModule implements Module {

    void p(String message, Object... params) {
        System.out.println(String.format(message, params));
    }

    private boolean isWebApp(String path) {
        return new File(SystemUtils.multiplatformPath(FilenameUtils.concat(path, "src/main/webapp"))).exists();
    }

    private List<String> getWebAppPaths() {
        List<String> webAppRoots = new ArrayList<>();
        String projectRoot = AppContext.current().appPath(File.separator);
        //scan for web applications
        File projectRootFile = new File(projectRoot);
        for (File file : projectRootFile.listFiles()) {
            if (file.isDirectory()) {
                if (isWebApp(file.getAbsolutePath())) {
                    webAppRoots.add(file.getAbsolutePath());
                }
            }
        }

        return webAppRoots;
    }

    private List<String> getWebAppMappingIncludes(String webApp) {
        return AppContext.current().getMappingIncludes(webApp);
    }

    private List<String> getAllClassesPaths(List<String> targetDirs) {
        List<String> classes = new ArrayList<>();
        FileWalker walker = new FileWalker();

        for (String targetDir : targetDirs) {
            walker.walk(targetDir, new FileWalkerListener() {
                @Override
                public void onFile(File directory, File file) {
                    //check if folder not has .ignoremapping file
                    if (new File(FilenameUtils.concat(directory.getAbsolutePath(), ".ignoremapping")).exists()) {
                        return;
                    }

                    if (FilenameUtils.getExtension(file.getAbsolutePath()).equals("class")) {
                        //remove absolute path
                        String className = file.getAbsolutePath().replace(targetDir, "");
                        classes.add(className);
                    }
                }

                @Override
                public void onDirectory(File file) {

                }
            });
        }

        return classes;
    }

    private List<String> getProjectsTargetDirs(List<String> projectPaths) {
        List<String> targetDirs = new ArrayList<>();
        FileWalker walker = new FileWalker();
        for (String projectPath : projectPaths) {
            walker.walk(projectPath, new FileWalkerListener() {
                @Override
                public void onFile(File directory, File file) {

                }

                @Override
                public void onDirectory(File file) {
                    if (file.getAbsolutePath().endsWith(SystemUtils.multiplatformPath("target/classes"))) {
                        if (!file.getAbsolutePath().contains("WEB-INF")) {
                            targetDirs.add(file.getAbsolutePath());
                        }
                    }
                }
            });
        }
        return targetDirs;
    }

    private ClassLoader createClassLoader(List<String> targetDirs) {
        try {
            List<String> jars = new ArrayList<>();
            FileWalker walker = new FileWalker();
            walker.walk(AppContext.current().appPath(File.separator), new FileWalkerListener() {
                @Override
                public void onFile(File directory, File file) {
                    if (FilenameUtils.getExtension(file.getAbsolutePath()).equals("jar")) {
                        jars.add(file.getAbsolutePath());
                    }
                }

                @Override
                public void onDirectory(File file) {

                }
            });

            URL[] urls = new URL[targetDirs.size() + jars.size()];
            int index = 0;
            for (String targetDir : targetDirs) {
                urls[index++] = new URL(String.format("file://%s/", targetDir));
            }

            for (String jar : jars) {
                urls[index++] = new URL(String.format("jar:file://%s!/", jar));
            }

            URLClassLoader cl = URLClassLoader.newInstance(urls);
            return cl;
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    @Action(value = "generate", description = "Generate hibernate mappings")
    public void generate(Properties properties) {
        try {
            Modules.instance().call("hibernate:generate-mappings", properties);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Action(value = "generate-configuration", description = "Generate hibernate configuration file")
    public void generateConfiguration(Properties properties) {
        p("This method is deprecated. Classes are loaded in code in HibernateSessionFactory");
    }

    private List<ClassHierarchy> getClassHierarchies(List<String> classesPath, ClassLoader classLoader) {
        List<ClassHierarchy> hierarchies = new ArrayList<>();
        List<Class> entities = new ArrayList<>();

        for (String classPath : classesPath) {
            String className = classPath;
            //remove .class extension and first separator
            className = className.substring(1, className.length() - 6);
            //substitute separator
            className = className.replace(File.separator.charAt(0), '.');

            try {
                Class c = classLoader.loadClass(className);

                if (c.getAnnotation(IgnoreMapping.class) == null) {
                    if (TypeUtils.isEntity(c)) {
                        entities.add(c);
                    }
                }

            } catch (Throwable e) {
                e.printStackTrace();
            }
        }

        for (Class entity : entities) {
            if (!isMappedEntitySubclass(entity, entities)) {
                ClassHierarchy hierarchy = createHierarchy(entity, entities, null);
                if (hierarchy.getSubTypes().size() > 0) {
                    p(hierarchy.toString());
                }
                hierarchies.add(hierarchy);
            }
        }

        return hierarchies;
    }

    private ClassHierarchy createHierarchy(Class entity, List<Class> entities, ClassHierarchy parent) {
        ClassHierarchy hierarchy = new ClassHierarchy();
        hierarchy.setSuperType(entity);
        hierarchy.setParent(parent);
        hierarchy.setSubTypes(
                entities.stream()
                        .filter(p -> p.getSuperclass().equals(entity))
                        .map(p -> createHierarchy(p, entities, hierarchy))
                        .collect(Collectors.toList())
        );
        return hierarchy;
    }

    public static boolean isMappedEntitySubclass(Class type, List<Class> allEntities) {
        return (
                allEntities.stream().anyMatch(e -> e.equals(type.getSuperclass())) &&
                TypeUtils.isEntity(type.getSuperclass()) &&
                type.getSuperclass().getAnnotation(IgnoreMapping.class) == null
        );
    }

    @Action(value = "generate-mappings", description = "Generate mappings for all entities in project")
    public void generateMappings(Properties properties) {
        try {
            if (!properties.containsKey("no-rebuild")) {
                Modules.instance().call("project:clean", new Properties());
                Modules.instance().call("project:build", new Properties());
            }

            List<String> webAppPaths = getWebAppPaths();
            for(String webAppPath : webAppPaths) {
                String webApp = FilenameUtils.getName(webAppPath);
                p("Generating mappings for %s", webApp);

                List<String> includes = getWebAppMappingIncludes(webApp);
                includes.forEach(i -> p("Found include: %s", i));

                List<String> projects = new ArrayList(Arrays.asList(webAppPath));
                includes.forEach(i -> projects.add(AppContext.current().appPath(i)));

                List<String> targetDirs = getProjectsTargetDirs(projects);
                targetDirs.forEach(t -> p("Target dir: %s", AppContext.current().relativePath(t)));

                ClassLoader classLoader = createClassLoader(targetDirs);

                List<String> classesPath = getAllClassesPaths(targetDirs);
                List<ClassHierarchy> hierarchies = getClassHierarchies(classesPath, classLoader);

                for (ClassHierarchy hierarchy : hierarchies) {
                    String resourcesPath = getResourcesPath(webAppPath);
                    mapEntity(hierarchy, resourcesPath);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void mapEntity(ClassHierarchy hierarchy, String resourcesPath) {
        Package pak = hierarchy.getSuperType().getPackage();
        String path = SystemUtils.multiplatformPath(pak.getName().replace(".", "/"));
        String xmlPath = SystemUtils.multiplatformPath(String.format("%s%s/%s.hbm.xml", resourcesPath, path, hierarchy.getSuperType().getSimpleName()));
        String xmlCustomPath = SystemUtils.multiplatformPath(String.format("%s%s/.%s.hbm.xml", resourcesPath, path, hierarchy.getSuperType().getSimpleName()));

        try {
            if (new File(xmlCustomPath).exists()) {
                FileUtils.copyFile(new File(xmlCustomPath), new File(xmlPath));

                p("Mapping copied from custom: %s", AppContext.current().relativePath(xmlPath));
            } else {
                FileUtils.forceMkdir(new File(FilenameUtils.getFullPath(xmlPath)));
                Mapper mapper = new Mapper(hierarchy);
                FileUtils.writeStringToFile(new File(xmlPath), mapper.map(), "UTF-8");

                p("Mapping created: %s", AppContext.current().relativePath(xmlPath));
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private String getResourcesPath(String webAppPath) {
        String resourcesBase = String.format("%s%s%s", webAppPath, File.separator, SystemUtils.multiplatformPath("src/main/resources/"));
        return resourcesBase;
    }

}
