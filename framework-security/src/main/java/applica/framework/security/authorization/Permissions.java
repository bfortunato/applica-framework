package applica.framework.security.authorization;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.type.filter.AnnotationTypeFilter;
import org.springframework.util.Assert;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 24/09/14
 * Time: 19:17
 */

/**
 * Allows to configure authorization in Applica Framework
 */
public class Permissions {

    private static Permissions s_instance;

    public static Permissions instance() {
        if (s_instance == null) {
            s_instance = new Permissions();
        }

        return s_instance;
    }

    private List<ContextInfo> contexts = new ArrayList<>();
    private List<PermissionInfo> permissions = new ArrayList<>();
    private Log logger = LogFactory.getLog(getClass());

    private Permissions() {

    }

    /**
     * Scan specified packages to configure authorization contexts automatically with annotations instead of using register method
     * @param packages
     */
    public void scan(Package... packages) {
        logger.info("Scanning packages...");

        ClassPathScanningCandidateComponentProvider scanner = new ClassPathScanningCandidateComponentProvider(false);
        scanner.addIncludeFilter(new AnnotationTypeFilter(applica.framework.security.annotations.AuthorizationContext.class));

        List<Class<?>> types = new ArrayList<>();
        for (Package myPackage : packages) {
            logger.info(" ********** Scanning package " + myPackage.getName() + " **********");
            for (BeanDefinition bean : scanner.findCandidateComponents(myPackage.getName())) {
                logger.info("Bean definition found " + bean.getBeanClassName());
                try {
                    Class<?> type = Class.forName(bean.getBeanClassName());
                    types.add(type);
                } catch (ClassNotFoundException e) {
                    logger.error("Error loading class type for bean definition");
                    e.printStackTrace();
                }
            }
        }

        types.forEach((type) -> {
            logger.info("Scanning type " + type.getName());

            Optional
                .ofNullable(type.getAnnotation(applica.framework.security.annotations.AuthorizationContext.class))
                .ifPresent((authorizationContextAnnotation) -> {
                    logger.info(type.getName() + " has AuthorizationContext annotation");

                    String contextPath = authorizationContextAnnotation.value();
                    registerContext(contextPath, (Class<?>) type);

                    Arrays.stream(type.getMethods()).forEach((m) -> {
                        Optional
                                .ofNullable(m.getDeclaredAnnotation(applica.framework.security.annotations.Permission.class))
                                .ifPresent((permissionAnnotation) -> {
                                    String permission = String.format("%s:%s", contextPath, permissionAnnotation.value());

                                    if (!permissions.stream().anyMatch(p -> p.path.equals(permission))) {
                                        PermissionInfo pinfo = new PermissionInfo();
                                        pinfo.path = permission;
                                        pinfo.method = m;
                                        permissions.add(pinfo);
                                        logger.info(String.format("Registered permission %s", permission));
                                    }

                                });
                    });
                });

        });
    }

    /**
     * Register new context in authorization
     * @param path
     * @param type
     */
    public void registerContext(String path, Class<?> type) {
        ContextInfo info = contexts.stream().filter((i) -> i.path.equals(path)).findFirst().orElseGet(() -> {
            ContextInfo newInfo = new ContextInfo();
            newInfo.path = path;
            contexts.add(newInfo);
            return newInfo;
        });

        info.type = type;
    }

    public void registerStatic(String permission) {
        if (!permissions.stream().anyMatch(p -> p.path.equals(permission))) {
            PermissionInfo pinfo = new PermissionInfo();
            pinfo.path = permission;
            pinfo.method = null;
            permissions.add(pinfo);
            logger.info(String.format("Registered static permission %s", permission));
        }
    }

    public boolean isStatic(String permission) {
        Optional<PermissionInfo> permissionInfoOptional = permissions.stream().filter(p -> p.path.equals(permission)).findFirst();
        return false;
    }

    public Optional<Method> getMethod(String permission) {
        Optional<PermissionInfo> permissionInfoOptional = permissions.stream().filter(p -> p.path.equals(permission)).findFirst();
        if (permissionInfoOptional.isPresent()) {
            return Optional.ofNullable(permissionInfoOptional.get().method);
        } else {
            return Optional.empty();
        }
    }

    public List<String> allPermissions() {
        return permissions.stream().map(p -> p.path).sorted().collect(Collectors.toList());
    }

    public void check(String permission) {
        permissions.stream()
                .filter(p -> p.path.equals(permission))
                .findFirst()
                .orElseThrow(() -> new RuntimeException(String.format("Permission %s not registered", permission)));
    }

    public Class getContextType(String permission) {
        Assert.isTrue(StringUtils.isNotEmpty(permission) && permission.contains(":"));
        String contextPath = permission.split(":")[0];
        return contexts.stream().filter(c -> c.path.equals(contextPath)).findFirst().orElseThrow(RuntimeException::new).type;
    }

    private class ContextInfo {
        private String path;
        private Class<?> type;
    }

    private class PermissionInfo {
        private String path;
        private Method method;
    }

}
