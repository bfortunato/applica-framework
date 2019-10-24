package applica.framework.security;

public class SecurityUtils {

    public static Object getLoggedUserId() throws AuthenticationException {
        User user = Security.withMe().getLoggedUser();
        if (user == null) {
            throw new AuthenticationException();
        }

        return user.getId();
    }

}
