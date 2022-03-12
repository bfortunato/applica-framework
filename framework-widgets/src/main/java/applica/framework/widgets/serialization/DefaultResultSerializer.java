package applica.framework.widgets.serialization;

import applica.framework.Entity;
import applica.framework.Query;
import applica.framework.Result;
import applica.framework.widgets.operations.ResultSerializerListener;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * Created by bimbobruno on 09/01/2017.
 */
public class DefaultResultSerializer implements ResultSerializer {

    private final ResultSerializerListener listener;
    private Class<? extends Entity> entityType;

    public DefaultResultSerializer(Class<? extends Entity> entityType, ResultSerializerListener listener) {
        this.listener = listener;
        this.entityType = entityType;
    }

    @Override
    public ObjectNode serialize(Result<? extends Entity> result, Object... params) throws SerializationException {
        try {
            ObjectMapper mapper = new ObjectMapper();

            ObjectNode objectNode = mapper.createObjectNode();
            objectNode.put("totalRows", result.getTotalRows());

            ArrayNode arrayNode = mapper.createArrayNode();

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
            mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);

            for (Entity entity : result.getRows()) {
                JsonNode node = serializeEntity(mapper, entity, params);
                arrayNode.add(node);
            }

            objectNode.put("rows", arrayNode);
            objectNode.put("page", result.getPage());
            objectNode.put("rowsPerPage", result.getRowsPerPage());
            objectNode.put("hasMore", result.isHasMore());

            return objectNode;
        } catch (Exception ex) {
            throw new SerializationException(ex);
        }
    }

    protected JsonNode serializeEntity(ObjectMapper mapper, Entity entity, Object ... params) {
        JsonNode node = mapper.valueToTree(entity);

        if (listener != null) {
            listener.onSerializeEntity((ObjectNode) node, entity, params);
        }

        return node;
    }

    @Override
    public Class<? extends Entity> getEntityType() {
        return entityType;
    }
}
