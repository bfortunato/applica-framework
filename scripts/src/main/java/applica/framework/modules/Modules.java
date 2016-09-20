package applica.framework.modules;

import applica.framework.annotations.Action;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.type.filter.AnnotationTypeFilter;
import org.springframework.util.Assert;

import java.util.*;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 01/10/14
 * Time: 19:04
 */
public class Modules {

    private static Modules s_instance;

    public static Modules instance() {
        if (s_instance == null) {
            s_instance = new Modules();
        }

        return s_instance;
    }

    private Modules() {}

    private List<ModuleInfo> modules = new ArrayList<>();

    public void scan() {
        Package pkg = getClass().getPackage();
        ClassPathScanningCandidateComponentProvider scanner = new ClassPathScanningCandidateComponentProvider(false);
        scanner.addIncludeFilter(new AnnotationTypeFilter(applica.framework.annotations.Module.class));

        List<Class<?>> types = new ArrayList<>();
        for (BeanDefinition bean : scanner.findCandidateComponents(pkg.getName())) {
            try {
                Class<?> type = Class.forName(bean.getBeanClassName());
                types.add(type);
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
            }
        }

        types.forEach((type) -> {
            Optional
                    .ofNullable(type.getAnnotation(applica.framework.annotations.Module.class))
                    .ifPresent((moduleAnnotation) -> {
                        ModuleInfo moduleInfo = new ModuleInfo();
                        moduleInfo.setModule(moduleAnnotation.value());
                        moduleInfo.setType((Class<? extends Module>) type);

                        List<ModuleMethodInfo> methodInfos = new ArrayList<>();

                        Arrays.stream(type.getMethods()).forEach((m) -> {
                            Optional
                                    .ofNullable(m.getDeclaredAnnotation(Action.class))
                                    .ifPresent((actionAnnotation) -> {
                                        ModuleMethodInfo moduleMethodInfo = new ModuleMethodInfo();
                                        moduleMethodInfo.setAction(actionAnnotation.value());
                                        moduleMethodInfo.setMethod(m);
                                        moduleMethodInfo.setDescription(actionAnnotation.description());
                                        methodInfos.add(moduleMethodInfo);
                                    });
                        });

                        moduleInfo.setMethods(methodInfos);
                        modules.add(moduleInfo);
                    });

        });
    }

    public void call(String path, Properties properties) throws ModuleNotFoundException, MethodNotFoundException {
        Assert.isTrue(path.contains(":"), "Bad call");
        String module;
        String action;
        String[] split = path.split(":");
        module = split[0];
        action = split[1];
        Optional<ModuleInfo> moduleInfo = modules.stream().filter(mod -> mod.getModule().equals(module)).findFirst();
        if (moduleInfo.isPresent()) {
            Module instance = null;
            try {
                instance = moduleInfo.get().getType().newInstance();
            } catch (Exception e) {
                e.printStackTrace();
            }
            if (instance != null) {
                Optional<ModuleMethodInfo> moduleMethodInfo = moduleInfo.get().getMethods().stream().filter(met -> met.getAction().equals(action)).findFirst();
                if (moduleMethodInfo.isPresent()) {
                    try {
                        moduleMethodInfo.get().getMethod().invoke(instance, properties);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                } else {
                    throw new MethodNotFoundException();
                }
            }
        } else {
            throw new ModuleNotFoundException();
        }
    }

    public List<ModuleInfo> getModules() {
        return modules;
    }

}
