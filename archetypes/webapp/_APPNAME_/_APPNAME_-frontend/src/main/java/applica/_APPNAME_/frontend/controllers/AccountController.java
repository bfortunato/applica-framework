package applica._APPNAME_.frontend.controllers;

import applica.framework.ValidationException;
import applica.framework.library.i18n.controllers.LocalizedController;
import applica.framework.library.responses.ErrorResponse;
import applica.framework.library.responses.SimpleResponse;
import applica._APPNAME_.frontend.facade.AccountFacade;
import applica._APPNAME_.frontend.facade.MailNotFoundException;
import applica._APPNAME_.frontend.viewmodel.UIRegistration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 4/17/13
 * Time: 5:47 PM
 */
@Controller
@RequestMapping("/account")
public class AccountController extends LocalizedController {

    @Autowired
    private AccountFacade accountFacade;

    @RequestMapping(value = "/register", method = RequestMethod.GET)
    public String register(Model model) {
        return "account/register";
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public String doRegister(UIRegistration data, Model model) {
        try {
            accountFacade.register(data);
        } catch (ValidationException e) {
            model.addAttribute("registrationError", localization.getMessage("msg.validation_error"));
            model.addAttribute("validation", e.getValidationResult());
            return "account/register";
        }
        model.addAttribute("registered", true);
        return "redirect:/auth/login";
    }

    @RequestMapping(value = "/activate", method = RequestMethod.GET)
    public String validate(String activationCode, Model model) {
        accountFacade.activate(activationCode);
        model.addAttribute("active", true);
        return "redirect:/auth/login";
    }

    @RequestMapping(value = "/resetPassword", method = RequestMethod.POST)
    public @ResponseBody SimpleResponse resetPassword(String mail) {
        try {
            accountFacade.resetPassword(mail);
        } catch (MailNotFoundException e) {
            return new ErrorResponse(localization.getMessage("msg.mail_not_found"));
        }
        return new SimpleResponse(false, "ok");
    }

}
