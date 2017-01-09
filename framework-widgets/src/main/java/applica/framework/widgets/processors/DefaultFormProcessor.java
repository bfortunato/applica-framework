package applica.framework.widgets.processors;

import applica.framework.Entity;
import applica.framework.widgets.serialization.DefaultEntitySerializer;
import applica.framework.widgets.serialization.EntitySerializer;
import applica.framework.widgets.serialization.SerializationException;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class DefaultFormProcessor implements FormProcessor {

    protected Log logger = LogFactory.getLog(getClass());

    private Class<? extends Entity> entityType;

    @Override
    public Entity process(ObjectNode data) throws FormProcessException {
        EntitySerializer serializer = new DefaultEntitySerializer(getEntityType());
        try {
            Entity entity = serializer.deserialize(data);
            return entity;
        } catch (SerializationException e) {
            throw new FormProcessException(e);
        }
    }

    @Override
    public ObjectNode deprocess(Entity entity) throws FormProcessException {
        EntitySerializer serializer = new DefaultEntitySerializer(getEntityType());
        try {
            ObjectNode data = serializer.serialize(entity);
            return data;
        } catch (SerializationException e) {
            throw new FormProcessException(e);
        }
    }

    @Override
    public Class<? extends Entity> getEntityType() {
        return entityType;
    }

    public void setEntityType(Class<? extends Entity> entityType) {
        this.entityType = entityType;
    }
}
