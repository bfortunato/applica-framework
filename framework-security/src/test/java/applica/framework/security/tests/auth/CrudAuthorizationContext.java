package applica.framework.security.tests.auth;

import applica.framework.security.User;
import applica.framework.security.annotations.AuthorizationContext;
import applica.framework.security.annotations.Permission;
import applica.framework.security.authorization.AuthorizationException;
import org.springframework.stereotype.Component;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 25/09/14
 * Time: 13:03
 */
@Component
@AuthorizationContext("crud")
public class CrudAuthorizationContext {

    @Permission("create")
    public void create(User user) throws AuthorizationException {

    }

    @Permission("update")
    public void update(User user) throws AuthorizationException {

    }

    @Permission("delete")
    public void delete(User user) throws AuthorizationException {
        throw new AuthorizationException("No one can delete");
    }
}
