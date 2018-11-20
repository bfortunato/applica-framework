package applica.framework.security.token;

import applica.framework.security.AuthenticationException;
import applica.framework.security.Security;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
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
                Security.tokenLogin(token, noCache);
            } catch (AuthenticationException e) {
                e.printStackTrace();
            }
        }

        filterChain.doFilter(servletRequest, servletResponse);
    }

}
