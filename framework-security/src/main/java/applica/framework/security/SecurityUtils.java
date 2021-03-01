package applica.framework.security;

import applica.framework.Query;
import applica.framework.Repo;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import javax.servlet.http.HttpServletRequest;

public class SecurityUtils {

    public static Object getLoggedUserId() throws AuthenticationException {
        User user = Security.withMe().getLoggedUser();
        if (user == null) {
            throw new AuthenticationException();
        }

        return user.getId();
    }

    public static String encryptAndGetPassword(String password) {
        return new BCryptPasswordEncoder().encode(password);
    }


    public static String getTokenFromHttpServletRequest(HttpServletRequest request) {

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

        if (StringUtils.isEmpty(token)) {
            token = request.getParameter("__TOKEN");
        }
        return token;
    }

    public static String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_CLUSTER_CLIENT_IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_FORWARDED_FOR");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_FORWARDED");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_VIA");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("REMOTE_ADDR");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }

}
