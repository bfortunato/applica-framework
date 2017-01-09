package applica.framework.widgets.serialization;

import applica.framework.Entity;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * Created by bimbobruno on 09/01/2017.
 */
public interface EntitySerializer {

    ObjectNode serialize(Entity entity) throws SerializationException;
    Entity deserialize(ObjectNode node) throws SerializationException;
    Class<? extends Entity> getEntityType();

}
