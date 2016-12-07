package applica.framework.widgets.entities;

import applica.framework.Entity;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.io.IOUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.type.filter.AssignableTypeFilter;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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

    public Optional<EntityDefinition> get(String id) {
        return definitions.stream().filter(d -> d.getId().equals(id)).findFirst();
    }

    public Optional<EntityDefinition> get(Class<? extends Entity> type) {
        return definitions.stream().filter(d -> d.getType().equals(type)).findFirst();
    }

    public void init(Package... packages) throws InstantiationException, IllegalAccessException {
        logger.info("Scanning packages for entities...");

        definitions = new ArrayList<>();

        ClassPathScanningCandidateComponentProvider scanner = new ClassPathScanningCandidateComponentProvider(false);
        scanner.addIncludeFilter(new AssignableTypeFilter(Entity.class));

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

        ObjectMapper mapper = new ObjectMapper();

        for (Class<?> type : types) {
            logger.info("Scanning type " + type.getName());

            String name = type.getName();
            String path = name.replace(".", "/").concat(".json");
            String resourcePath = "/entities/".concat(path);

            logger.info("Checking entity definition in path: " + resourcePath);

            EntityDefinition definition = null;

            InputStream in = getClass().getResourceAsStream(resourcePath);
            if (in != null) {
                try {
                    String json = IOUtils.toString(in);
                    definition = mapper.readValue(json, EntityDefinition.class);
                    definition.setType((Class<? extends Entity>) type);
                } catch (Exception e) {
                    throw new RuntimeException(e);
                } finally {
                    if (in != null) {
                        IOUtils.closeQuietly(in);
                    }
                }
            } else {
                EntityId entityId = type.getAnnotation(EntityId.class);
                if (entityId != null) {
                    String id = entityId.value();
                    definition = new EntityDefinition(id, (Class<? extends Entity>) type);
                }
            }

            if (definition != null) {
                //check definition id
                EntityDefinition fDefinition = definition;
                if (definitions.stream().anyMatch(d -> d.getId().equals(fDefinition.getId()))) {
                    throw new RuntimeException(String.format("Entity with id %s already exists in file %s", definition.getId(), resourcePath));
                }

                definitions.add(definition);

                logger.info("Definition added for entity " + definition.getId());
            }
        }
    }

}
