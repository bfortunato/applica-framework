package applica.framework.security.token;

import applica.framework.ApplicationContextProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 12/12/14
 * Time: 10:03
 */
public class TokenAuthenticationProvider implements AuthenticationProvider {

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        ByTokenAuthenticationToken token = (ByTokenAuthenticationToken) authentication;
        if (token != null) {
            AuthTokenValidator validator = new DefaultAuthTokenValidator();
            try {
                if (validator.isExpired(token.getToken())) {
                    throw new BadCredentialsException("Token was expired");
                }
            } catch (Exception e) {
                throw new BadCredentialsException("Bad token", e);
            }

            AuthTokenDataExtractor extractor = new DefaultAuthTokenDataExtractor();
            try {
                String username = extractor.getUsername(token.getToken());
                String password = extractor.getPassword(token.getToken());
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(username, password);
                AuthenticationManager authenticationManager = ApplicationContextProvider.provide().getBean("authenticationManager", AuthenticationManager.class);
                Authentication auth = authenticationManager.authenticate(usernamePasswordAuthenticationToken);
                return auth;
            } catch (Exception ex) {
                throw new BadCredentialsException("Bad credentials", ex);
            }
        }

        throw new BadCredentialsException("Token not provided");
    }

    @Override
    public boolean supports(Class<?> aClass) {
        return aClass.equals(ByTokenAuthenticationToken.class);
    }
}
