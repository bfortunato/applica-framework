package applica._APPNAME_.frontend.controllers;

import applica.framework.library.i18n.controllers.LocalizedController;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 3/19/13
 * Time: 4:22 PM
 */
@Controller
@RequestMapping("/auth")
public class AuthController extends LocalizedController {


    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public String login(HttpServletRequest request, Model model) {
        boolean registrationOk = request.getParameter("registrationOk") == "true";
        boolean activationOk = request.getParameter("activationOk") == "true";

        model.addAttribute("registrationOk", registrationOk);
        model.addAttribute("activationOk", activationOk);

        return "/auth/login";
    }

    @RequestMapping(value = "/logout_ok", method = RequestMethod.GET)
    public String logoutOk(Model model) {
        return "/auth/logout_ok";
    }

    @RequestMapping("/fail")
    public String fail(HttpServletRequest request, Model model) {
        model.addAttribute("loginError", "bad username or password");

        return "/auth/login";
    }
}