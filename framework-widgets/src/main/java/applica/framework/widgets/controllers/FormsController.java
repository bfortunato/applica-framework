package applica.framework.widgets.controllers;

import applica.framework.library.responses.FormActionResponse;
import applica.framework.library.responses.SimpleResponse;
import applica.framework.widgets.actions.FormAction;
import applica.framework.widgets.utils.CrudUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 26/10/13
 * Time: 12:48
 */
@RequestMapping("/forms")
public class FormsController {

    @Autowired
    private ApplicationContext applicationContext;

    @RequestMapping("/{identifier}")
    public @ResponseBody SimpleResponse buildFormResponse(@PathVariable String identifier, HttpServletRequest request) {
        return CrudUtils.createFormResponse(request, identifier);
    }

    @RequestMapping("/process/{identifier}")
    public @ResponseBody SimpleResponse processForm(@PathVariable String identifier, HttpServletRequest request, HttpServletResponse response) {
        FormAction formAction = (FormAction) applicationContext.getBean(String.format("action-%s", identifier));
        FormActionResponse formActionResponse = formAction.perform(identifier, request, response);

        return formActionResponse;
    }

}
