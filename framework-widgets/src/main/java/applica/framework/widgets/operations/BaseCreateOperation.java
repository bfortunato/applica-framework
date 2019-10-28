package applica.framework.widgets.operations;

import applica.framework.AEntity;
import applica.framework.Entity;
import applica.framework.library.responses.Response;
import applica.framework.library.utils.SystemOptionsUtils;
import applica.framework.security.Security;
import applica.framework.security.authorization.AuthorizationException;
import applica.framework.security.utils.PermissionUtils;
import applica.framework.widgets.acl.CrudPermission;
import applica.framework.widgets.serialization.DefaultEntitySerializer;
import applica.framework.widgets.serialization.EntitySerializer;
import applica.framework.widgets.serialization.SerializationException;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.Map;

/**
 * Created by antoniolovicario on 05/12/17.
 */
public class BaseCreateOperation implements CreateOperation {

    private Class<? extends Entity> entityType;


    @Override
    public ObjectNode create(Map<String, Object> params) throws OperationException {

        try {
            authorize();
        } catch (AuthorizationException e) {
            throw new OperationException(Response.UNAUTHORIZED);
        }

        EntitySerializer serializer = new DefaultEntitySerializer(getEntityType());
        ObjectNode node = null;
        try {
            node = serializer.serialize(createEntity(params));
        } catch (SerializationException e) {
            e.printStackTrace();
        }
        finishNode(node, params);
        return node;

    }

    public void authorize() throws AuthorizationException {
        if (SystemOptionsUtils.isEnabled("crud.authorization.enabled")) {
            PermissionUtils.authorize(Security.withMe().getLoggedUser(), "entity", CrudPermission.NEW, getEntityType());
        }
    }

    public Entity createEntity(Map<String, Object> params) {
        return new AEntity();
    }

    protected void finishNode(ObjectNode node, Map<String, Object> params) throws OperationException {

    }


    public Class<? extends Entity> getEntityType() {
        return entityType;
    }

    public void setEntityType(Class<? extends Entity> entityType) {
        this.entityType = entityType;
    }
}
