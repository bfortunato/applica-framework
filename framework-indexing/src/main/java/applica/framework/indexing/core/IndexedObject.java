package applica.framework.indexing.core;

import applica.framework.library.dynaobject.BaseDynamicObject;

public class IndexedObject extends BaseDynamicObject {

    private String uniqueId;

    public String getUniqueId() {
        return uniqueId;
    }

    public void setUniqueId(String uniqueId) {
        this.uniqueId = uniqueId;
    }
}
