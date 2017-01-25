package applica.framework.widgets.serialization;

import applica.framework.Entity;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * Created by bimbobruno on 09/01/2017.
 */
public class DefaultEntitySerializer implements EntitySerializer {

    private Class<? extends Entity> entityType;

    public DefaultEntitySerializer(Class<? extends Entity> entityType) {
        this.entityType = entityType;
    }

    @Override
    public ObjectNode serialize(Entity entity) throws SerializationException {
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_IGNORED_PROPERTIES, false);
            mapper.configure(DeserializationFeature.FAIL_ON_INVALID_SUBTYPE, false);
            mapper.configure(DeserializationFeature.FAIL_ON_MISSING_EXTERNAL_TYPE_ID_PROPERTY, false);
            mapper.configure(DeserializationFeature.FAIL_ON_MISSING_CREATOR_PROPERTIES, false);
            mapper.configure(DeserializationFeature.FAIL_ON_NULL_CREATOR_PROPERTIES, false);
            mapper.configure(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES, false);
            mapper.configure(DeserializationFeature.FAIL_ON_NUMBERS_FOR_ENUMS, false);
            mapper.configure(DeserializationFeature.FAIL_ON_READING_DUP_TREE_KEY, false);
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            mapper.configure(DeserializationFeature.FAIL_ON_UNRESOLVED_OBJECT_IDS, false);
            JsonNode node = mapper.valueToTree(entity);
            return (ObjectNode) node;
        } catch (Exception ex) {
            throw new SerializationException(ex);
        }
    }

    @Override
    public Entity deserialize(ObjectNode node) throws SerializationException {
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_IGNORED_PROPERTIES, false);
            mapper.configure(DeserializationFeature.FAIL_ON_INVALID_SUBTYPE, false);
            mapper.configure(DeserializationFeature.FAIL_ON_MISSING_EXTERNAL_TYPE_ID_PROPERTY, false);
            mapper.configure(DeserializationFeature.FAIL_ON_MISSING_CREATOR_PROPERTIES, false);
            mapper.configure(DeserializationFeature.FAIL_ON_NULL_CREATOR_PROPERTIES, false);
            mapper.configure(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES, false);
            mapper.configure(DeserializationFeature.FAIL_ON_NUMBERS_FOR_ENUMS, false);
            mapper.configure(DeserializationFeature.FAIL_ON_READING_DUP_TREE_KEY, false);
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            mapper.configure(DeserializationFeature.FAIL_ON_UNRESOLVED_OBJECT_IDS, false);
            Entity entity = mapper.treeToValue(node, getEntityType());
            return entity;
        } catch (Exception e) {
            throw new SerializationException(e);
        }
    }

    @Override
    public Class<? extends Entity> getEntityType() {
        return entityType;
    }
}
