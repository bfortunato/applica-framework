package applica.framework.widgets.entities;

import applica.framework.EntitiesScanner;
import applica.framework.Entity;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Created by bimbobruno on 06/12/2016.
 */
public class EntitiesRegistry implements EntitiesScanner.ScanHandler {

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

    public List<String> getAllRevisionEnabledEntities() {
        return definitions.stream().filter(d -> d.getType().getAnnotation(EntityId.class).allowRevision()).map(d -> d.getType().getAnnotation(EntityId.class).value()).collect(Collectors.toList());
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

    @Override
    public void handle(Class<? extends Entity> entityType) {
        EntityDefinition definition;
        EntityId entityId = entityType.getAnnotation(EntityId.class);
        if (entityId != null) {
            String id = entityId.value();
            definition = new EntityDefinition(id, (Class<? extends Entity>) entityType);

            if (definitions.stream().anyMatch(d -> d.getId().equals(id))) {
                throw new RuntimeException(String.format("Entity with id %s already exists", definition.getId()));
            }

            definitions.add(definition);

            logger.info("Definition added for entity " + definition.getId());
        }
    }
}
