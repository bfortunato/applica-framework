package applica._APPNAME_.api.controllers;

import applica._APPNAME_.services.exceptions.MailNotFoundException;
import applica._APPNAME_.services.exceptions.PasswordNotValidException;
import applica._APPNAME_.services.AccountService;
import applica._APPNAME_.services.exceptions.MailAlreadyExistsException;
import applica._APPNAME_.services.exceptions.MailNotValidException;
import applica.framework.ValidationException;
import applica.framework.library.responses.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import static applica.framework.library.responses.Response.ERROR;
import static applica.framework.library.responses.Response.OK;
import static applica._APPNAME_.api.responses.ResponseCode.*;

/**
 * Applica (www.applicadoit.com)
 * User: bimbobruno
 * Date: 4/17/13
 * Time: 5:47 PM
 */
@RestController
@RequestMapping("/account")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public Response register(String name, String mail, String password) {
        try {
            accountService.register(name, mail, password);
            return new Response(OK);
        } catch (MailAlreadyExistsException e) {
            return new Response(ERROR_MAIL_ALREADY_EXISTS);
        } catch (MailNotValidException e) {
            return new Response(ERROR_MAIL_NOT_VALID);
        } catch (PasswordNotValidException e) {
            return new Response(ERROR_PASSWORD_NOT_VALID);
        } catch (ValidationException e) {
            return new Response(ERROR_VALIDATION);
        } catch (Exception e) {
            e.printStackTrace();
            return new Response(ERROR);
        }
    }

    @RequestMapping(value = "/confirm", method = RequestMethod.POST)
    public Response confirm(String activationCode) {
        try {
            accountService.confirm(activationCode);
            return new Response(OK);
        } catch (MailNotFoundException e) {
            return new Response(ERROR_MAIL_NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new Response(ERROR);
        }
    }

    @RequestMapping(value = "/resetPassword", method = RequestMethod.POST)
    public Response resetPassword(String mail) {
        try {
            accountService.resetPassword(mail);
            return new Response(OK);
        } catch (MailNotFoundException e) {
            return new Response(ERROR_MAIL_NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new Response(ERROR);
        }
    }

}
