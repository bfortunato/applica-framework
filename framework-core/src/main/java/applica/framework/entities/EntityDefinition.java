package applica.framework.entities;

import applica.framework.Entity;

/**
 * Created by bimbobruno on 06/12/2016.
 */
public class EntityDefinition {

    private String id;
    private Class<? extends Entity> type;

    public EntityDefinition(String id, Class<? extends Entity> type) {
        this.id = id;
        this.type = type;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Class<? extends Entity> getType() {
        return type;
    }

    public void setType(Class<? extends Entity> type) {
        this.type = type;
    }
}
