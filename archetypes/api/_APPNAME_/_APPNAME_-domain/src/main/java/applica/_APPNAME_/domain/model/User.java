package applica._APPNAME_.domain.model;

import applica._APPNAME_.domain.model.base.UserBase;
import applica.framework.AEntity;
import applica.framework.annotations.ManyToMany;
import applica.framework.entities.EntityId;
import applica.framework.security.Role;
import org.springframework.util.StringUtils;

import java.util.Date;
import java.util.List;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 28/10/13
 * Time: 17:08
 */
@EntityId("user")
public class User extends UserBase implements applica.framework.security.User {

    public String getInitials() {
        if (StringUtils.hasLength(getMail())) {
            return getMail().substring(0, 1);
        }

        return "@";
    }

    @Override
    public String toString() {
        return getMail();
    }

    @Override
    public String getUsername() {
        return getMail();
    }
}
