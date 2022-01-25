package applica.framework.security.token;

import applica.framework.security.AuthenticationException;
import applica.framework.security.Security;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.RequestMatcher;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 11/12/14
 * Time: 18:23
 */
public class TokenAuthenticationFilter extends AbstractAuthenticationProcessingFilter {

    protected TokenAuthenticationFilter(String defaultFilterProcessesUrl) {
        super(defaultFilterProcessesUrl);
    }

    protected TokenAuthenticationFilter(RequestMatcher requiresAuthenticationRequestMatcher) {
        super(requiresAuthenticationRequestMatcher);
    }

    protected TokenAuthenticationFilter(String defaultFilterProcessesUrl, AuthenticationManager authenticationManager) {
        super(defaultFilterProcessesUrl, authenticationManager);
    }

    protected TokenAuthenticationFilter(RequestMatcher requiresAuthenticationRequestMatcher, AuthenticationManager authenticationManager) {
        super(requiresAuthenticationRequestMatcher, authenticationManager);
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws org.springframework.security.core.AuthenticationException, IOException, ServletException {
        String token = request.getHeader("token");
        Boolean noCache = Boolean.parseBoolean(request.getHeader("no-cache"));

        if (StringUtils.isEmpty(token)) {
            token = request.getHeader("x-auth-token");
        }

        if (StringUtils.isEmpty(token)) {
            String authorization = request.getHeader("Authorization");
            if (StringUtils.isNotEmpty(authorization)) {
                if (authorization.startsWith("Token ")) {
                    token = authorization.substring("Token ".length()).trim();
                }
            }
        }

        if (StringUtils.isEmpty(token)) {
            token = request.getParameter("__TOKEN");
        }

        if (StringUtils.isNotEmpty(token)) {
            try {
                return Security.tokenAuthentication(token, noCache);
            } catch (AuthenticationException e) {
                logger.warn("Token login failed in filter");
            }
        }

        return null;
    }

}
