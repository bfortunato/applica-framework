package applica.framework.widgets.operations;

import applica.framework.Entity;
import applica.framework.Query;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * Created by bimbobruno on 21/02/2017.
 */
public interface ResultSerializerListener {

    void onSerializeEntity(ObjectNode node, Entity entity, Object ... params);
}
