package applica.framework.data.security;

import applica.framework.Entity;

/**
 * Created by bimbobruno on 17/09/15.
 */
public interface SecureEntity extends Entity {

    Object getOwnerId();
    void setOwnerId(Object id);

}
