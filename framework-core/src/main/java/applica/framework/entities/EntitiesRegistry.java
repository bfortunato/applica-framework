package applica.framework.entities;

import applica.framework.Entity;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.type.filter.AnnotationTypeFilter;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by bimbobruno on 06/12/2016.
 */
public class EntitiesRegistry {

    private static EntitiesRegistry _instance;

    public static EntitiesRegistry instance() {
        if (_instance == null) {
            _instance = new EntitiesRegistry();
        }

        return _instance;
    }

    private Log logger = LogFactory.getLog(getClass());
    private boolean initialized;
    private List<Package> packages = new ArrayList<>();

    private EntitiesRegistry() {

    }

    private List<EntityDefinition> definitions = new ArrayList<>();

    public void register(String id, Class<? extends Entity> type) {
        if (definitions.stream().anyMatch(d -> d.getId().equals(id))) {
            throw new RuntimeException(String.format("Entity with id %s already registered", id));
        }

        definitions.add(new EntityDefinition(id, type));

        logger.info(String.format("Entity %s registered with type %s", id, type.getName()));
    }

    public Class<? extends Entity> get(String id) {
        return definitions.stream().filter(d -> d.getId().equals(id)).findFirst().orElseThrow(() -> new RuntimeException(String.format("Entity not found: %s", id))).getType();
    }

    public void addPackage(Package pack) {
        packages.add(pack);
    }

    public void init() throws InstantiationException, IllegalAccessException {
        if (initialized) {
            return;
        }

        initialized = true;

        logger.info("Scanning packages for entities...");

        ClassPathScanningCandidateComponentProvider scanner = new ClassPathScanningCandidateComponentProvider(false);
        scanner.addIncludeFilter(new AnnotationTypeFilter(EntityId.class));

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

        for (Class<?> type : types) {
            logger.info("Scanning type " + type.getName());

            EntityId entityId = type.getAnnotation(EntityId.class);
            String id = entityId.value();
            EntitiesRegistry.instance().register(id, (Class<? extends Entity>) type);
        }
    }

}
