package applica.framework.modules;

import applica.framework.AppContext;
import applica.framework.Applica;
import applica.framework.SystemUtils;
import applica.framework.annotations.Action;
import applica.framework.editors.FileEditor;
import applica.framework.library.utils.FileWalker;
import applica.framework.library.utils.FileWalkerListener;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.Assert;

import java.io.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Properties;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 01/10/14
 * Time: 19:02
 */
@applica.framework.annotations.Module("project")
public class ProjectModule implements Module {

    public static final String APPNAME_PH = "_APPNAME_";

    void p(String message, Object... params) {
        System.out.println(String.format(message, params));
    }

    private static String removeFirstSlash(String path) {
        if (path.startsWith("/")) {
            return path.substring(1);
        }

        return path;
    }

    @Action(value = "create", description = "Create a new app with specified name")
    public void create(Properties properties) {
        List<String> editableExtensions = Arrays.asList("java", "xml", "vm", "properties", "manifest");

        Assert.isTrue(properties.containsKey("name"), "missing name. Specify -Dname=<value>");
        Assert.isTrue(properties.containsKey("archetype"), "missing archetype. Specify -Darchetype=<value>");

        String appName = (String) properties.get("name");
        String archetype = (String) properties.get("archetype");

        p("Creating %s with %s archetype...", appName, archetype);

        File root = new File(appName);
        if (root.exists()) {
            System.err.println("Directory " + appName + " already exists");
            System.exit(2);
            return;
        }

        root.mkdirs();

        File projectStatusFile = new File(FilenameUtils.concat(root.getAbsolutePath(), ".projectfiles"));
        List<String> projectFiles = new ArrayList<>();

        String[] appPaths = {
                SystemUtils.multiplatformPath(String.format("archetypes/%s/_APPNAME_", archetype))
        };

        for (String appPath : appPaths) {
            if (!new File(String.format("%s/%s", Applica.frameworkHome, appPath)).exists()) {
                p("Archetype %s not found", archetype);
                System.exit(2);
                return;
            }
        }

        for (String appPath : appPaths) {
            FileWalker fileWalker = new FileWalker();
            fileWalker.walk(String.format("%s/%s", Applica.frameworkHome, appPath), new FileWalkerListener() {
                @Override
                public void onFile(File directory, File file) {
                    String newDirPath = removeFirstSlash(directory.getAbsolutePath()
                            .replace(Applica.frameworkHome, "")
                            .replace(SystemUtils.multiplatformPath(String.format("archetypes/%s/", archetype)), "")
                            .replace(APPNAME_PH, appName));
                    File newDirectory = new File(newDirPath);
                    if (!newDirectory.exists()) {
                        newDirectory.mkdirs();
                        //System.out.println(String.format("Created directory %s", newDirPath));
                    }

                    String newPath = removeFirstSlash(file.getAbsolutePath()
                            .replace(Applica.frameworkHome, "")
                            .replace(SystemUtils.multiplatformPath(String.format("archetypes/%s/", archetype)), "")
                            .replace(APPNAME_PH, appName));

                    File newFile = new File(newPath);
                    if (editableExtensions.contains(FilenameUtils.getExtension(newPath))) {
                        FileEditor editor = new FileEditor();
                        editor.setSource(file);
                        editor.setDestination(newFile);
                        editor.setSearch(APPNAME_PH);
                        editor.setReplace(appName);
                        editor.save();
                    } else {
                        try { FileUtils.copyFile(file, newFile); } catch (IOException e) { }
                    }

                    String relativePath = SystemUtils.multiplatformPath(newFile.getAbsolutePath().replace(root.getAbsolutePath(), "."));
                    p(SystemUtils.multiplatformPath("./" + newPath));
                    projectFiles.add(String.format("%s\t%d", relativePath, newFile.lastModified()));
                }

                @Override
                public void onDirectory(File file) {

                }
            });
        }

        try {
            FileUtils.writeLines(projectStatusFile, projectFiles);
        } catch (IOException e) {}
    }

    @Action(value = "update", description = "Update the project")
    public void update(Properties properties) {
        List<String> editableExtensions = Arrays.asList("java", "xml", "vm", "properties", "manifest");

        String appName = AppContext.current().getAppName();
        String archetype = AppContext.current().getArchetype();

        p("Updating %s with %s archetype...", appName, archetype);

        File root = new File(AppContext.current().appPath("/"));
        File projectStatusFile = new File(AppContext.current().appPath("/.projectfiles"));
        List<String> projectFiles = new ArrayList<>();

        if (!projectStatusFile.exists()) {
            System.out.println("ERROR: .projectfiles file not found.");
            System.exit(2);
            return;
        }

        String[] appPaths = {
                SystemUtils.multiplatformPath(String.format("archetypes/%s/_APPNAME_", archetype))
        };

        for (String appPath : appPaths) {
            FileWalker fileWalker = new FileWalker();
            fileWalker.walk(String.format("%s/%s", Applica.frameworkHome, appPath), new FileWalkerListener() {
                @Override
                public void onFile(File directory, File file) {
                    String newDirPath = removeFirstSlash(directory.getAbsolutePath()
                            .replace(Applica.frameworkHome, "")
                            .replace(SystemUtils.multiplatformPath(String.format("archetypes/%s/", archetype)), "")
                            .replace(APPNAME_PH, appName));

                    newDirPath = removeFirstSlash(newDirPath.substring(appName.length()));

                    File newDirectory = new File(newDirPath);
                    if (!newDirectory.exists()) {
                        newDirectory.mkdirs();
                        //System.out.println(String.format("Created directory %s", newDirPath));
                    }

                    String newPath = removeFirstSlash(file.getAbsolutePath()
                            .replace(Applica.frameworkHome, "")
                            .replace(SystemUtils.multiplatformPath(String.format("archetypes/%s/", archetype)), "")
                            .replace(APPNAME_PH, appName));

                    newPath = removeFirstSlash(newPath.substring(appName.length()));

                    boolean deletedFromUser = false;
                    File newFile = new File(newPath);
                    //check if destinationFile exists and is changed from user
                    if (newFile.exists()) {
                        if (isChanged(projectStatusFile, newFile)) {
                            if (!SystemUtils.confirm(String.format("%s seems to be changed. Replace?", newFile.toString()))) {
                                String relativePath = SystemUtils.multiplatformPath(newFile.getAbsolutePath().replace(root.getAbsolutePath(), "."));
                                p("UNCHANGED: %s", SystemUtils.multiplatformPath("./" + newPath));
                                projectFiles.add(String.format("%s\t%d", relativePath, 0));
                                return;
                            }
                        }
                        if (!newFile.delete()) {
                            p("Cannot delete %s", newFile);
                        }
                    } else {
                        if (isDeleted(projectStatusFile, newFile)) {
                            deletedFromUser = true;
                            if (!SystemUtils.confirm(String.format("%s seems to be deleted. Restore?", newFile.toString()))) {
                                String relativePath = SystemUtils.multiplatformPath(newFile.getAbsolutePath().replace(root.getAbsolutePath(), "."));
                                p("IGNORED: %s", SystemUtils.multiplatformPath("./" + newPath));
                                projectFiles.add(String.format("%s\t%d", relativePath, 0));
                                return;
                            }
                        }
                    }

                    if (editableExtensions.contains(FilenameUtils.getExtension(newPath))) {
                        FileEditor editor = new FileEditor();
                        editor.setSource(file);
                        editor.setDestination(newFile);
                        editor.setSearch(APPNAME_PH);
                        editor.setReplace(appName);
                        editor.save();
                    } else {
                        try { FileUtils.copyFile(file, newFile); } catch (IOException e) { }
                    }

                    String relativePath = SystemUtils.multiplatformPath(newFile.getAbsolutePath().replace(root.getAbsolutePath(), "."));
                    p("%s: %s",
                            deletedFromUser ? "RESTORED" : "REPLACED",
                            SystemUtils.multiplatformPath("./" + newPath));
                    projectFiles.add(String.format("%s\t%d", relativePath, newFile.lastModified()));
                }

                @Override
                public void onDirectory(File file) {

                }
            });
        }

        try {
            FileUtils.writeLines(projectStatusFile, projectFiles);
        } catch (IOException e) {}
    }

    private boolean isChanged(File projectStatusFile, File file) {
        BufferedReader br = null;
        try {
            br = new BufferedReader(new FileReader(projectStatusFile));
            String line;
            String relativePath = AppContext.current().relativePath(file.getAbsolutePath());
            while ((line = br.readLine()) != null) {
                if (StringUtils.isNotEmpty(line)) {
                    String[] split = line.split("\t");
                    String name = split[0];
                    Long lastModified = Long.parseLong(split[1]);
                    if (name.equals(relativePath)) {
                        if (!lastModified.equals(file.lastModified())) {
                            return true;
                        }
                    }
                }
            }

            return false;
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        } finally {
            if (br != null) try {
                br.close();
            } catch (IOException e) {}
        }
    }

    private boolean isDeleted(File projectStatusFile, File file) {
        BufferedReader br = null;
        try {
            br = new BufferedReader(new FileReader(projectStatusFile));
            String line;
            String relativePath = AppContext.current().relativePath(file.getAbsolutePath());
            while ((line = br.readLine()) != null) {
                if (StringUtils.isNotEmpty(line)) {
                    String[] split = line.split("\t");
                    String name = split[0];
                    Long lastModified = Long.parseLong(split[1]);
                    if (name.equals(relativePath)) {
                        return !file.exists();
                    }
                }
            }

            return false;
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        } finally {
            if (br != null) try {
                br.close();
            } catch (IOException e) {}
        }
    }

    @Action(value = "build", description = "Build the project")
    public void build(Properties properties) {
        try {
            System.out.println(String.format("Building %s...", AppContext.current().getAppName()));
            Process process = Runtime.getRuntime().exec(getMaven() + " package");
            BufferedReader input = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line = null;
            while ((line = input.readLine()) != null) {
                System.out.println(line);
            }
            input.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Action(value = "clean", description = "Clean the project")
    public void clean(Properties properties) {
        try {
            System.out.println(String.format("Cleaning %s...", AppContext.current().getAppName()));
            Process process = Runtime.getRuntime().exec(getMaven() + " clean");
            BufferedReader input = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line = null;
            while ((line = input.readLine()) != null) {
                System.out.println(line);
            }
            input.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public String getMaven() {
        return SystemUtils.multiplatformPath(String.format(FilenameUtils.getFullPathNoEndSeparator(Applica.mavenHome) + "/bin/mvn"));
    }

}
