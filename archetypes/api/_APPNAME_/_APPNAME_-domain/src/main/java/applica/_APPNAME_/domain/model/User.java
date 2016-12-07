package applica._APPNAME_.domain.model;

import applica._APPNAME_.domain.model.base.UserBase;
import org.springframework.util.StringUtils;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 6/12/2016
 * Time: 17:08
 */
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
