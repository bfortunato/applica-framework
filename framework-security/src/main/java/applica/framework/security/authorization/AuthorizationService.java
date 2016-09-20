package applica.framework.security.authorization;

import applica.framework.security.User;

import java.util.List;

/**
 * Applica
 * User: Bruno Fortunato
 * Date: 9/3/13
 * Time: 10:57 AM
 * To change this template use File | Settings | File Templates.
 */
public interface AuthorizationService {

    void authorize(User user, String permission, Object... parameters) throws AuthorizationException;

}
