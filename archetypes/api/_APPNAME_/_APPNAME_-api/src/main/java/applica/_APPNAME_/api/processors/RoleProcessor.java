package applica._APPNAME_.api.processors;

import applica._APPNAME_.domain.model.Role;
import applica.framework.Entity;
import applica.framework.library.SimpleItem;
import applica.framework.widgets.processors.DefaultFormProcessor;
import applica.framework.widgets.processors.FormProcessException;
import applica.framework.widgets.processors.FormProcessor;
import applica.framework.widgets.serialization.DefaultEntitySerializer;
import applica.framework.widgets.serialization.EntitySerializer;
import applica.framework.widgets.serialization.SerializationException;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

/**
 * Created by bimbobruno on 24/01/2017.
 */

@Component
public class RoleProcessor implements FormProcessor {

    @Override
    public Entity process(ObjectNode data) throws FormProcessException {
        try {
            EntitySerializer entitySerializer = new DefaultEntitySerializer(getEntityType());
            Role role = ((Role) entitySerializer.deserialize(data));
            ArrayNode array = (ArrayNode) data.get("permissions");
            if (role.getPermissions() == null) {
                role.setPermissions(new ArrayList<>());
            }
            for (int i = 0; i < array.size(); i++) {
                role.getPermissions().add(array.get(i).asText());
            }

            return role;
        } catch (SerializationException e) {
            throw new FormProcessException(e);
        }
    }

    @Override
    public ObjectNode deprocess(Entity entity) throws FormProcessException {
        try {
            EntitySerializer entitySerializer = new DefaultEntitySerializer(getEntityType());
            Role role = ((Role) entity);
            ObjectNode node = entitySerializer.serialize(role);
            ArrayNode permissions = node.putArray("permissions");
            for (String permission : role.getPermissions()) {
                permissions.addPOJO(new SimpleItem(permission, permission));
            }

            return node;
        } catch (SerializationException e) {
            throw new FormProcessException(e);
        }
    }

    @Override
    public Class<? extends Entity> getEntityType() {
        return Role.class;
    }
}
