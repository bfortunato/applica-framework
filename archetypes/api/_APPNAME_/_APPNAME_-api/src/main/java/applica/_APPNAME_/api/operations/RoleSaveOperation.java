package applica._APPNAME_.api.operations;

import applica._APPNAME_.domain.data.RolesRepository;
import applica._APPNAME_.domain.model.Role;
import applica.framework.Entity;
import applica.framework.library.responses.Response;
import applica.framework.widgets.operations.OperationException;
import applica.framework.widgets.operations.SaveOperation;
import applica.framework.widgets.serialization.DefaultEntitySerializer;
import applica.framework.widgets.serialization.EntitySerializer;
import applica.framework.widgets.serialization.SerializationException;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

/**
 * Created by bimbobruno on 24/01/2017.
 */

@Component
public class RoleSaveOperation implements SaveOperation {

    @Autowired
    private RolesRepository rolesRepository;

    @Override
    public Class<? extends Entity> getEntityType() {
        return Role.class;
    }

    @Override
    public Entity save(ObjectNode data) throws OperationException {
        try {
            EntitySerializer entitySerializer = new DefaultEntitySerializer(getEntityType());
            Role role = ((Role) entitySerializer.deserialize(data));
            ArrayNode array = (ArrayNode) data.get("_permissions");
            ArrayList<String> permissions = new ArrayList<>();
            for (int i = 0; i < array.size(); i++) {
                permissions.add(array.get(i).get("value").asText());
            }
            role.setPermissions(permissions);

            rolesRepository.save(role);

            return role;
        } catch (SerializationException e) {
            throw new OperationException(Response.ERROR_SERIALIZATION);
        }
    }
}
