package applica._APPNAME_.api.localization;

import applica._APPNAME_.domain.model.localization.LocalizationManager;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

/**
 * Created by antoniolovicario on 04/08/17.
 */
public class LocalizationFilter extends GenericFilterBean {

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        String localization = request.getHeader("localization");

        if (!StringUtils.isEmpty(localization)) {
            LocalizationManager.getInstance().setCurrentLanguage(localization);
        }

        filterChain.doFilter(servletRequest, servletResponse);
    }
}
