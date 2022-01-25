package applica.framework.security;

import applica.framework.ApplicationContextProvider;
import applica.framework.library.cache.Cache;
import applica.framework.library.cache.MemoryCache;
import applica.framework.security.authorization.AuthorizationException;
import applica.framework.security.authorization.AuthorizationService;
import applica.framework.security.token.AuthTokenValidator;
import applica.framework.security.token.ByTokenAuthenticationToken;
import applica.framework.security.token.DefaultAuthTokenValidator;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.Assert;

import java.util.List;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 31/10/13
 * Time: 10:27
 */

/**
 * Manage security for users. Use with() static method to specify user, otherwhise security is for currently logged user
 * Don't use autowire with this class, because is needed also in non DI contexts (example: velocity)
 */
public class Security {

    private static Cache cache = new MemoryCache();
    private static Log logger = LogFactory.getLog(Security.class);

    private static AuthorizationService authorizationService;
    private static AuthenticationManager authenticationManager;

    private SecurityInstance securityInstance;

    private static Security s_instance = null;

    /**
     * Gets security instance for logged user.
     * @return
     */
    public static Security withMe() {
        if (s_instance == null) {
            s_instance = new Security();
        }

        return s_instance;
    }

    /**
     * Gets security instance for specified user. Methods like isAuthenticated() have not sense.
     * @param user
     * @return
     */
    public static Security with(User user) {
        return new Security(new SecurityInstance(() -> user, null));
    }

    private Security(SecurityInstance instance) {
        this.securityInstance = instance;
        this.securityInstance.setAuthorizationService(getAuthorizationService());
    }

    public Security() {}

    public UserDetailsImpl getLoggedUserDetails() {
        UserDetailsImpl userDetails = null;

        SecurityContext securityContext = SecurityContextHolder.getContext();
        Authentication authentication = securityContext.getAuthentication();
        if(authentication != null) {

            if(authentication.getPrincipal() instanceof UserDetailsImpl) {
                userDetails = (UserDetailsImpl) authentication.getPrincipal();
            } else if(authentication.getDetails() instanceof  UserDetailsImpl) {
                userDetails = (UserDetailsImpl) authentication.getDetails();
            }
        }

        return userDetails;
    }

    public boolean isPermittedOne(List<String> permissions, Object... params) {
        return permissions.stream().anyMatch((p) -> {
            return this.isPermitted(p, params);
        });
    }

    public boolean isPermittedAll(List<String> permissions, Object... params) {
        return permissions.stream().allMatch((p) -> {
            return this.isPermitted(p, params);
        });
    }

    protected static AuthorizationService getAuthorizationService() {
        if (authorizationService == null) {
            authorizationService = ApplicationContextProvider.provide().getBean(AuthorizationService.class);

            if (authorizationService == null) {
                throw new RuntimeException("authorizationService not configured");
            }
        }

        return authorizationService;
    }

    protected static AuthenticationManager getAuthenticationManager() {
        if (authenticationManager == null) {
            authenticationManager = ApplicationContextProvider.provide().getBean("authenticationManager", AuthenticationManager.class);

            if (authenticationManager == null) {
                throw new RuntimeException("authenticationManager not configured");
            }
        }

        return authenticationManager;
    }

    public User getLoggedUser() {
        UserDetailsImpl userDetails = getLoggedUserDetails();

        if(userDetails != null) {
            return userDetails.getUser();
        }

        return null;
    }

    public boolean isAuthenticated() {
        UserDetailsImpl impl = getLoggedUserDetails();
        return impl != null;
    }

    private SecurityInstance getInstance() {
        if (securityInstance == null) {
            securityInstance = new SecurityInstance(() -> getLoggedUser(), getAuthorizationService());
        }

        return securityInstance;
    }

    public boolean isPermitted(String permission, Object... params) {
        return getInstance().isPermitted(permission, params);
    }

    public void authorize(String permission, Object... params) throws AuthorizationException {
        getInstance().authorize(permission, params);
    }

    public static void tokenLogin(String token) throws AuthenticationException {
        tokenLogin(token, null);
    }

    public static Authentication tokenAuthentication(String token, Boolean noCache) throws AuthenticationException {
        Assert.hasLength(token);

        Authentication authentication = null;
        if ((noCache != null && noCache)) {
            authentication = getCachedAuthentication(token);
        }

        if (authentication == null) {
            SecurityContextHolder.getContext().setAuthentication(null);


            ByTokenAuthenticationToken byTokenAuthenticationToken = new ByTokenAuthenticationToken(token);
            authentication = getAuthenticationManager().authenticate(byTokenAuthenticationToken);

            if (authentication != null) {
                cache.put(token, Cache.TIME_ONE_MINUTE, authentication);

                logger.info("User authenticated: " + authentication.getName());
            } else {
                throw new AuthenticationException("bad username or password");
            }
        }

        return authentication;
    }

    public static void tokenLogin(String token, Boolean noCache) throws AuthenticationException {
        Authentication authentication = tokenAuthentication(token, noCache);
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    private static Authentication getCachedAuthentication(String token) {
        AuthTokenValidator validator = new DefaultAuthTokenValidator();
        try {
            if (validator.isExpiring(token)) {
                cache.invalidate(token);
                return null;
            }
        } catch (Exception e) {
            cache.invalidate(token);
            return null;
        }

        Authentication authentication = ((Authentication) cache.get(token));
        if (authentication != null) {
            logger.info("User authenticated by cache: " + authentication.getName());
        }

        return authentication;
    }

    public static void manualLogin(String username, String password) throws AuthenticationException {
        SecurityContextHolder.getContext().setAuthentication(null);

        Assert.hasLength(username);
        Assert.hasLength(password);

        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(username, password);
        Authentication authentication = getAuthenticationManager().authenticate(usernamePasswordAuthenticationToken);

        if(authentication != null) {
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } else {
            throw new AuthenticationException("bad username or password");
        }
    }

}
