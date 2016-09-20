package applica.framework.library.ui;

import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.web.servlet.View;
import org.springframework.web.servlet.ViewResolver;

import javax.servlet.http.HttpServletRequest;
import java.util.Locale;
import java.util.Map;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 5/29/13
 * Time: 4:18 PM
 */
public class PartialViewRenderer {

    public String render(ViewResolver viewResolver, String viewName, Map<String, Object> model, Locale locale, HttpServletRequest request) throws Exception {
        View view = viewResolver.resolveViewName(viewName, locale);
        if(view != null) {
            MockHttpServletResponse response = new MockHttpServletResponse();
            view.render(model, request, response);

            return response.getContentAsString();
        } else {
            return "";
        }
    }

}
