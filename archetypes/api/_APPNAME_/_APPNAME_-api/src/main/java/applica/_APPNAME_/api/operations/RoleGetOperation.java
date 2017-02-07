package applica._APPNAME_.api.operations;

import applica.commodo.domain.data.RolesRepository;
import applica.commodo.domain.model.Role;
import applica.framework.Entity;
import applica.framework.library.SimpleItem;
import applica.framework.widgets.operations.GetOperation;
import applica.framework.widgets.operations.OperationException;
import applica.framework.widgets.serialization.DefaultEntitySerializer;
import applica.framework.widgets.serialization.EntitySerializer;
import applica.framework.widgets.serialization.SerializationException;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Created by bimbobruno on 24/01/2017.
 */

@Component
public class RoleGetOperation implements GetOperation {

    @Autowired
    private RolesRepository rolesRepository;

    @Override
    public ObjectNode get(Object id) throws OperationException {
        try {
            Role role = rolesRepository.get(id).orElseThrow(() -> new OperationException("Role not found: " + id));

            EntitySerializer entitySerializer = new DefaultEntitySerializer(getEntityType());
            ObjectNode node = entitySerializer.serialize(role);
            ArrayNode permissions = node.putArray("_permissions");
            for (String permission : role.getPermissions()) {
                permissions.addPOJO(new SimpleItem(permission, permission));
            }

            return node;
        } catch (SerializationException e) {
            throw new OperationException(e);
        }
    }

    @Override
    public Class<? extends Entity> getEntityType() {
        return Role.class;
    }

}
