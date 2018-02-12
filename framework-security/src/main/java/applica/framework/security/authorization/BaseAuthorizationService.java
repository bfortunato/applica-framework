package applica.framework.security.authorization;

import applica.framework.security.User;
import org.apache.commons.lang3.ArrayUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import java.lang.reflect.Method;
import java.util.Optional;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 31/10/13
 * Time: 10:59
 */
public class BaseAuthorizationService implements AuthorizationService {

    @Autowired
    private ApplicationContext applicationContext;

    @Override
    public void authorize(User user, String permission, Object... parameters) throws AuthorizationException {
        Assert.notNull(user, "AuthService: user must be specified");
        Assert.isTrue(StringUtils.hasLength(permission), "ItecAuthService: permission must be specified");

        Permissions.instance().check(permission);

        Boolean authorized = false;
        //first of all, check if user has permission
        if ((user.getRoles() != null && user.getRoles().stream().anyMatch((r) -> r.getPermissions() != null && r.getPermissions().stream().anyMatch((p) -> p.equals(permission))))) {
            //se il permesso da controllare è statico ed è stato trovato tra quelli associati all'utente corrente, l'autorizzazione è fornita...
            authorized = true;
        }
        //altrimenti, se non trova il permesso tra quelli statici controlla tra quelli dinamici
        if (! authorized) {
            String[] elements = permission.split(":");
            Assert.isTrue(elements.length >= 2, "Bad permission format: " + permission);

            //if there is an implementation of the method in some context, call the method
            Optional<Method> method = Permissions.instance().getMethod(permission);
            if (method.isPresent()) {
                Class authorizationContextType = Permissions.instance().getContextType(permission);
                Object authorizationContext = applicationContext.getBean(authorizationContextType);
                try {
                    method.get().invoke(authorizationContext, ArrayUtils.add(parameters, 0, user));
                    authorized = true;
                } catch (Exception e) {
                    if (!(e.getCause() instanceof AuthorizationException)) {
                        e.printStackTrace();
                        throw new RuntimeException(e);
                    } else {
                        throw (AuthorizationException) e.getCause();
                    }
                }
            }
        }

        if (!authorized) {
            throw new AuthorizationException("L'utente corrente non ha il permesso " + permission);
        }
    }

}
