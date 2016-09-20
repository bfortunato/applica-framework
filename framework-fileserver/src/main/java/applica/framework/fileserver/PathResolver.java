package applica.framework.fileserver;

import javax.servlet.http.HttpServletRequest;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 4/22/13
 * Time: 12:12 PM
 */
public class PathResolver {

    public String resolve(HttpServletRequest request) {
        String requestPath = request.getRequestURI().replace(request.getContextPath(), "");
        return requestPath;
    }

}
