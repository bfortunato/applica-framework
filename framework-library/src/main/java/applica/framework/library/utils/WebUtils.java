package applica.framework.library.utils;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 29/10/13
 * Time: 12:22
 */
public class WebUtils {

    public static String mapPublicPath(String path) {
        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = servletRequestAttributes.getRequest();
        String scheme = request.getScheme();
        String serverName = request.getServerName();
        int port = request.getServerPort();
        String contextPath = request.getContextPath();
        String url;
        if(port == 80) {
            url = String.format("%s://%s%s/%s", scheme, serverName, contextPath, path);
        } else {
            url = String.format("%s://%s:%d%s/%s", scheme, serverName, port, contextPath, path);
        }
        return url;
    }

}
