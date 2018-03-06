package applica.framework.indexing.core;

import applica.framework.library.dynaobject.BaseDynamicObject;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class IndexedObject extends BaseDynamicObject {

    private String uniqueId;

    public String getUniqueId() {
        return uniqueId;
    }

    public void setUniqueId(String uniqueId) {
        this.uniqueId = uniqueId;
    }

    @Override
    public ObjectNode toObjectNode(ObjectMapper mapper) {
        ObjectNode node = super.toObjectNode(mapper);
        node.put("id", uniqueId);

        return node;
    }
}
