package applica.framework.security;

import applica.framework.security.authorization.AuthorizationException;
import applica.framework.security.authorization.AuthorizationService;

import java.util.function.Supplier;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 25/09/14
 * Time: 11:26
 */
class SecurityInstance {

    private Supplier<User> userSupplier;
    private AuthorizationService authorizationService;

    protected SecurityInstance(Supplier<User> userSupplier, AuthorizationService authorizationService) {
        this.userSupplier = userSupplier;
        this.authorizationService = authorizationService;
    }

    public boolean isPermitted(String permission, Object... params) {
        try {
            authorize(permission, params);
        } catch (AuthorizationException e) {
            return false;
        }

        return true;
    }

    public void authorize(String permission, Object... params) throws AuthorizationException {
        authorizationService.authorize(userSupplier.get(), permission, params);
    }

    public void setAuthorizationService(AuthorizationService authorizationService) {
        this.authorizationService = authorizationService;
    }
}
