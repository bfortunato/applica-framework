package applica.framework.widgets.operations;

import applica.framework.*;
import applica.framework.library.responses.Response;
import applica.framework.library.utils.ProgramException;
import applica.framework.widgets.mapping.EntityMapper;
import applica.framework.widgets.serialization.DefaultResultSerializer;
import applica.framework.widgets.serialization.ResultSerializer;
import applica.framework.widgets.serialization.SerializationException;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Objects;

public class BaseFindOperation implements FindOperation, ResultSerializerListener {

    @Autowired(required = false)
    private EntityMapper entityMapper;

    private Class<? extends Entity> entityType;

    public Class<? extends Entity> getEntityType() {
        return entityType;
    }

    public void setEntityType(Class<? extends Entity> type) {
        this.entityType = type;
    }

    @Override
    public ObjectNode find(Query query) throws OperationException {
        if (getEntityType() == null) throw new ProgramException("Entity entityType is null");

        Result<Entity> result = fetch(query);
        ObjectNode node = serialize(result);

        return node;
    }

    protected Result<Entity> fetch(Query query) throws OperationException {
        return (Result<Entity>) Repo.of(getEntityType()).find(query);
    }

    protected ObjectNode serialize(Result<? extends Entity> result) throws OperationException {
        ResultSerializer serializer = new DefaultResultSerializer(getEntityType(), this);
        try {
            return serializer.serialize(result);
        } catch (SerializationException e) {
            throw new OperationException(Response.ERROR_SERIALIZATION);
        }
    }

    @Override
    public void onSerializeEntity(ObjectNode node, Entity entity) {

    }

    protected EntityMapper map() {
        Objects.requireNonNull(entityMapper, "EntityMapper is null. Did you add a bean in application context configuration?");

        return entityMapper;
    }
}
