package applica.framework.widgets.actions;

import applica.framework.library.responses.FormActionResponse;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created with IntelliJ IDEA.
 * User: bimbobruno
 * Date: 26/10/13
 * Time: 16:05
 * To change this template use File | Settings | File Templates.
 */
public interface FormAction {
    FormActionResponse perform(String identifier, HttpServletRequest request, HttpServletResponse response);
}
