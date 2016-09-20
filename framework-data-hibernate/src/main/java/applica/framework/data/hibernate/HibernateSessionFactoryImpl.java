package applica.framework.data.hibernate;

import applica.framework.Entity;
import applica.framework.data.hibernate.annotations.IgnoreMapping;
import applica.framework.library.options.OptionsManager;
import applica.framework.library.utils.ClassHierarchy;
import applica.framework.library.utils.ProgramException;
import applica.framework.library.utils.TypeUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.type.filter.AnnotationTypeFilter;
import org.springframework.core.type.filter.AssignableTypeFilter;
import org.springframework.core.type.filter.TypeFilter;

import java.io.File;
import java.util.*;
import java.util.stream.Collectors;


/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 01/10/14
 * Time: 18:55
 */
public class HibernateSessionFactoryImpl implements HibernateSessionFactory {

    protected Log logger = LogFactory.getLog(getClass());

    private Object lock = new Object();

    public class Options {
        public static final String DATASOURCES = "applica.framework.data.hibernate.dataSources";

        public static final String PACKAGES = "packages";
        public static final String CONNECTION_DRIVERCLASS = "connection.driver_class";
        public static final String CONNECTION_URL = "connection.url";
        public static final String CONNECTION_USERNAME = "connection.username";
        public static final String CONNECTION_PASSWORD = "connection.password";
        public static final String DIALECT = "dialect";

        public static final String C3P0_ACQUIRE_INCREMENT = "c3p0.acquire_increment";
        public static final String C3P0_IDLE_TEST_PERIOD = "c3p0.idle_test_period";
        public static final String C3P0_TIMEOUT = "c3p0.timeout";
        public static final String C3P0_MAX_SIZE = "c3p0.max_size";
        public static final String C3P0_MAX_STATEMENTS = "c3p0.max_statements";
        public static final String C3P0_MIN_SIZE = "c3p0.min_size";
        public static final String C3P0_ACQUIRERETRYATTEMPTS = "c3p0.acquireRetryAttempts";
        public static final String C3P0_ACQUIRERETRYDELAY = "c3p0.acquireRetryDelay";

        public static final String CURRENT_SESSION_CONTEXT_CLASS = "current_session_context_class";
        public static final String SHOW_SQL = "show_sql";
        public static final String HBM2DLL_AUTO = "hbm2ddl.auto";
    }
    @Autowired
    protected OptionsManager options;

    protected Map<String, SessionFactory> sessionFactories = new HashMap<>();

    protected SessionFactory createSessionFactory(String dataSource) {
        if (!getDataSources(options).contains(dataSource)) {
            throw new RuntimeException("Bad dataSource name: " + dataSource);
        }

        Configuration configuration = configureHibernate(dataSource);

        ServiceRegistry serviceRegistry = new StandardServiceRegistryBuilder().applySettings(configuration.getProperties()).build();
        SessionFactory sessionFactory = configuration.buildSessionFactory(serviceRegistry);

        return sessionFactory;

    }

    protected Configuration configureHibernate(String dataSource) {
        Configuration configuration = new Configuration();
        Properties properties = new Properties();

        properties.setProperty("hibernate." + Options.CONNECTION_DRIVERCLASS, getFrameworkOptions(Options.CONNECTION_DRIVERCLASS, dataSource));
        properties.setProperty("hibernate." + Options.CONNECTION_URL, getFrameworkOptions(Options.CONNECTION_URL, dataSource));
        properties.setProperty("hibernate." + Options.CONNECTION_USERNAME, getFrameworkOptions(Options.CONNECTION_USERNAME, dataSource));
        properties.setProperty("hibernate." + Options.CONNECTION_PASSWORD, getFrameworkOptions(Options.CONNECTION_PASSWORD, dataSource));
        properties.setProperty("hibernate." + Options.DIALECT, getFrameworkOptions(Options.DIALECT, dataSource));

        properties.setProperty("hibernate." + Options.C3P0_ACQUIRE_INCREMENT, getFrameworkOptions(Options.C3P0_ACQUIRE_INCREMENT, dataSource));
        properties.setProperty("hibernate." + Options.C3P0_IDLE_TEST_PERIOD, getFrameworkOptions(Options.C3P0_IDLE_TEST_PERIOD, dataSource));
        properties.setProperty("hibernate." + Options.C3P0_TIMEOUT, getFrameworkOptions(Options.C3P0_TIMEOUT, dataSource));
        properties.setProperty("hibernate." + Options.C3P0_MAX_SIZE, getFrameworkOptions(Options.C3P0_MAX_SIZE, dataSource));
        properties.setProperty("hibernate." + Options.C3P0_MAX_STATEMENTS, getFrameworkOptions(Options.C3P0_MAX_STATEMENTS, dataSource));
        properties.setProperty("hibernate." + Options.C3P0_MIN_SIZE, getFrameworkOptions(Options.C3P0_MIN_SIZE, dataSource));
        properties.setProperty("hibernate." + Options.C3P0_ACQUIRERETRYATTEMPTS, getFrameworkOptions(Options.C3P0_ACQUIRERETRYATTEMPTS, dataSource));
        properties.setProperty("hibernate." + Options.C3P0_ACQUIRERETRYDELAY, getFrameworkOptions(Options.C3P0_ACQUIRERETRYDELAY, dataSource));

        properties.setProperty("hibernate." + Options.CURRENT_SESSION_CONTEXT_CLASS, getFrameworkOptions(Options.CURRENT_SESSION_CONTEXT_CLASS, dataSource));
        properties.setProperty("hibernate." + Options.SHOW_SQL, getFrameworkOptions(Options.SHOW_SQL, dataSource));
        properties.setProperty("hibernate." + Options.HBM2DLL_AUTO, getFrameworkOptions(Options.HBM2DLL_AUTO, dataSource));

        logger.info("Hibernate configuration");
        for (String key : properties.stringPropertyNames()) {
            logger.info(String.format("%s: %s", key, properties.getProperty(key)));
        }

        configuration.addProperties(properties);

        List<Class<? extends Entity>> allEntities = getAllMappedEntities(dataSource);
        for (Class<? extends Entity> entityType : allEntities) {
            String resource = String.format("%s.hbm.xml", entityType.getCanonicalName().replace(".", "/"));

            logger.info(String.format("Mapped class: %s", resource));

            configuration.addResource(resource);
        }

        //configuration.configure();

        return configuration;
    }

    protected List<Class<? extends Entity>> getAllMappedEntities(String dataSource) {
        List<Class<? extends Entity>> allEntities = new ArrayList<>();

        String packages = getFrameworkOptions(Options.PACKAGES, dataSource);
        String[] packageList = packages.split(",");
        for (int i = 0; i < packageList.length; i++) {
            packageList[i] = packageList[i].trim();
        }

        ClassPathScanningCandidateComponentProvider scanner = new ClassPathScanningCandidateComponentProvider(false);
        TypeFilter tf = new AssignableTypeFilter(Entity.class);
        AnnotationTypeFilter af = new AnnotationTypeFilter(IgnoreMapping.class);
        scanner.addIncludeFilter(tf);
        scanner.addExcludeFilter(af);

        for (String pack : packageList) {
            Set<BeanDefinition> beanDefinitions = scanner.findCandidateComponents(pack);

            for (BeanDefinition beanDefinition : beanDefinitions) {
                try {
                    allEntities.add((Class<? extends Entity>) Class.forName(beanDefinition.getBeanClassName()));
                } catch (ClassNotFoundException e) {
                    throw new ProgramException("Cannot load entity class", e);
                }
            }
        }

        List<ClassHierarchy> classHierarchies = getClassHierarchies(allEntities);

        return classHierarchies.stream().map((h) -> (Class<? extends Entity>) h.getSuperType()).collect(Collectors.toList());
    }

    protected String getFrameworkOptions(String key, String dataSource) {
        String fullKey = String.format("applica.framework.data.hibernate.%s.%s", dataSource, key);
        String value = options.get(fullKey);
        if (StringUtils.isEmpty(value)) {
            throw new ProgramException("Options not found: " + fullKey);
        }

        return value;
    }

    protected SessionFactory getSessionFactory(String dataSource) {
        return getSessionFactory(dataSource, false);
    }

    protected SessionFactory getSessionFactory(String dataSource, boolean create) {
        if (sessionFactories.containsKey(dataSource)) {
            return sessionFactories.get(dataSource);
        } else {
            if (create) {
                SessionFactory sessionFactory = null;
                synchronized (this.lock) {
                    sessionFactory = createSessionFactory(dataSource);
                    Objects.requireNonNull(sessionFactory, "Session factory is not initialized correctly");
                    sessionFactories.put(dataSource, sessionFactory);
                }
                return sessionFactory;
            }
        }

        return null;
    }

    protected List<String> getDataSources(OptionsManager options) {
        String dataSourcesValue = options.get(Options.DATASOURCES);
        String[] split = dataSourcesValue.split(",");
        List<String> dataSources = new ArrayList<>();
        for (String ds : split) {
            dataSources.add(ds.trim());
        }

        return dataSources;
    }

    @Override
    public Session getSession(String dataSource) {
        return getSessionFactory(dataSource, true).openSession();
    }

    @Override
    public void dispose(String dataSource) {
        if (getSessionFactory(dataSource) != null) {
            getSessionFactory(dataSource).close();
        }
    }

    private List<ClassHierarchy> getClassHierarchies(List<Class<? extends Entity>> classes) {
        List<ClassHierarchy> hierarchies = new ArrayList<>();
        List<Class> entities = new ArrayList<>();

        for (Class c : classes) {
            if (c.getAnnotation(IgnoreMapping.class) == null) {
                if (TypeUtils.isEntity(c)) {
                    entities.add(c);
                }
            }
        }

        for (Class entity : entities) {
            if (!isMappedEntitySubclass(entity, entities)) {
                ClassHierarchy hierarchy = createHierarchy(entity, entities, null);
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

}
