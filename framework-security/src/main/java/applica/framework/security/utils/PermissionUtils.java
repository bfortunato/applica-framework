package applica.framework.security.utils;

import applica.framework.security.Security;
import applica.framework.security.User;
import applica.framework.security.authorization.AuthorizationException;
import applica.framework.security.authorization.Permissions;

public class PermissionUtils {

    public static void authorize(User user, String context, String method, Object... params) throws AuthorizationException {
        Security.with(user).authorize(String.format("%s:%s", context, method), params);
    }


    public static boolean isPermitted(User user, String context, String method, Object... params) {
        String permission = String.format("%s:%s", context, method);
        if (Permissions.instance().isRegistered(permission))
            return Security.with(user).isPermitted(permission, params);
        return false;
    }
}
