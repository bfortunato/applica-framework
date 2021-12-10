package applica.framework.widgets.serialization;

import applica.framework.Entity;
import applica.framework.Result;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * Created by bimbobruno on 09/01/2017.
 */

/**
 * Serializer used to serialize entities for grids
 */
public interface ResultSerializer {

    ObjectNode serialize(Result<? extends Entity> result, Object ... params) throws SerializationException;
    Class<? extends Entity> getEntityType();

}
