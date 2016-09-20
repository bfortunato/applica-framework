package applica.framework.data.security;

import applica.framework.AEntity;

/**
 * Created by bimbobruno on 17/09/15.
 */
public class ASecureEntity extends AEntity implements SecureEntity {

    private Object ownerId;

    @Override
    public Object getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Object ownerId) {
        this.ownerId = ownerId;
    }

}
