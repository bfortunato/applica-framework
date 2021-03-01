package applica.framework.library.dynaobject;

import applica.framework.Entity;

/**
 * Created by bimbobruno on 07/04/2020.
 */
public class DynamicEntity extends BaseDynamicObject implements Entity {

    private Object id;

    @Override
    public Object getId() {
        return id;
    }

    @Override
    public void setId(Object id) {
        this.id = id;
    }

}
