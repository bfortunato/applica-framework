package applica._APPNAME_.domain.model;

import applica.framework.AEntity;
import applica.framework.Entity;
import applica.framework.SEntity;
import applica.framework.StringIdEntity;
import applica.framework.security.*;
import org.apache.http.entity.StringEntity;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 31/10/13
 * Time: 13:31
 */
public class UserDetails extends UserDetailsImpl implements Entity {

    private Object id;

    public UserDetails(applica.framework.security.User user) {
        super(user);
    }

    @Override
    public Object getId() {
        return AEntity.checkedId(id);
    }

    @Override
    public void setId(Object id) {
        this.id = AEntity.checkedId(id);
    }
}
