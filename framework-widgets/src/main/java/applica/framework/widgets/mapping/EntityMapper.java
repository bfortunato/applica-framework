package applica.framework.widgets.mapping;

import applica.framework.Entity;
import applica.framework.Repo;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.lang3.StringUtils;

import java.util.Objects;
import java.util.Optional;

/**
 * Created by bimbobruno on 14/02/2017.
 */
public class EntityMapper {

    public static final String SUFFIX = "Id";

    @FunctionalInterface
    public interface Setter<T extends Entity> {
        void set(T value);
    }

    @FunctionalInterface
    public interface Getter<T extends Entity> {
        T get();
    }

    public void idToEntity(ObjectNode node, Entity entity, Class<? extends Entity> relatedType, String property){
        Objects.requireNonNull(entity, "Cannot convert id to entity: entity is null");
        Objects.requireNonNull(node, "Cannot convert id to entity: node is null");

        String id = node.get(property + SUFFIX).asText();
        if (!StringUtils.isEmpty(id)) {
            Optional<? extends Entity> relatedEntity = Repo.of(relatedType).get(id);
            if (!relatedEntity.isPresent()) {
                throw new RuntimeException(String.format("%s: %s", property, id));
            }

            try {
                PropertyUtils.setProperty(entity, property, relatedEntity.get());
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
    }

    public void entityToId(Entity entity, ObjectNode node, String property) {
        Objects.requireNonNull(entity, "Cannot convert entity to id: entity is null");
        Objects.requireNonNull(node, "Cannot convert entity to id: node is null");

        Entity relatedEntity = null;
        try {
            relatedEntity = (Entity) PropertyUtils.getProperty(entity, property);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        if (relatedEntity == null) {
            node.put(property + SUFFIX, "");
        } else {
            String id = relatedEntity.getId() != null ? relatedEntity.getId().toString() : null;
            node.put(property + SUFFIX, id);
        }

    }

}
