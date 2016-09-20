package applica.framework.security.filters;

import applica.framework.security.filters.wrapper.RequestWrapper;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

/**
 * Created by bimbobruno on 18/05/16.
 */
public class CrossScriptingFilter implements Filter {


    private Log logger = LogFactory.getLog(getClass());
    private FilterConfig filterConfig;

    public void init(FilterConfig filterConfig) throws ServletException {
        this.filterConfig = filterConfig;
    }

    public void destroy() {
        this.filterConfig = null;
    }

    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        if (((HttpServletRequest) request).getMethod().equalsIgnoreCase("POST")) {
            logger.info("Inlter CrossScriptingFilter  ...............");
            chain.doFilter(new RequestWrapper((HttpServletRequest) request), response);
            logger.info("Outlter CrossScriptingFilter ...............");
        } else {
            chain.doFilter(request, response);
        }
    }
}
