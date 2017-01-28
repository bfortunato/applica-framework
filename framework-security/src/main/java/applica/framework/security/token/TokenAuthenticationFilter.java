package applica.framework.security.token;

import applica.framework.security.AuthenticationException;
import applica.framework.security.Security;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 11/12/14
 * Time: 18:23
 */
public class TokenAuthenticationFilter extends GenericFilterBean {

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        String token = request.getHeader("token");

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

        if (StringUtils.isNotEmpty(token)) {
            try {
                Security.tokenLogin(token);
            } catch (AuthenticationException e) {
                e.printStackTrace();
            }
        }

        filterChain.doFilter(servletRequest, servletResponse);
    }

}
