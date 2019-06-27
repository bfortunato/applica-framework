package applica.framework.widgets.operations;

import applica.framework.Entity;
import applica.framework.Query;
import applica.framework.Repo;
import applica.framework.Result;
import applica.framework.library.responses.Response;
import applica.framework.library.utils.ProgramException;
import applica.framework.security.Security;
import applica.framework.security.authorization.AuthorizationException;
import applica.framework.security.utils.PermissionUtils;
import applica.framework.widgets.acl.CrudPermission;
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

        try {
            PermissionUtils.authorize(Security.withMe().getLoggedUser(), "entity", CrudPermission.LIST, getEntityType());
        } catch (AuthorizationException e) {
            throw new OperationException(Response.UNAUTHORIZED);
        }

        Result<? extends Entity> result = fetch(query);
        ObjectNode node = serialize(result);

        return node;
    }

    protected Result<? extends Entity> fetch(Query query) throws OperationException {
        return Repo.of(getEntityType()).find(query);
    }

    protected ObjectNode serialize(Result<? extends Entity> result) throws OperationException {
        ResultSerializer serializer = new DefaultResultSerializer(getEntityType(), this);
        try {
            return serializer.serialize(result);
        } catch (SerializationException e) {
            throw new OperationException(Response.ERROR_SERIALIZATION, e);
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
