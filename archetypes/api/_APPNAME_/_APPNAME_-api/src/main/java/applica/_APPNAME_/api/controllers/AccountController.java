package applica._APPNAME_.api.controllers;

import applica._APPNAME_.services.responses.ResponseCode;
import applica._APPNAME_.services.exceptions.*;
import applica._APPNAME_.services.AccountService;
import applica.framework.library.validation.ValidationException;
import applica.framework.library.base64.URLData;
import applica.framework.library.responses.Response;
import applica.framework.library.responses.ValueResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

import static applica.framework.library.responses.Response.ERROR;
import static applica.framework.library.responses.Response.OK;
import static applica._APPNAME_.services.responses.ResponseCode.*;

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


    @Autowired
    private AuthService authService;

    @PostMapping("/register")
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

    @PostMapping("/confirm")
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

    @PostMapping("/recover")
    public Response recover(String mail) {
        try {
            accountService.recover(mail);
            return new Response(OK);
        } catch (MailNotFoundException e) {
            return new Response(ERROR_MAIL_NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new Response(ERROR);
        }
    }

    @GetMapping("/{userId}/cover")
    public Response cover(@PathVariable String userId) {
        try {
            URLData coverImage = accountService.getCoverImage(userId, "268x129");
            if (coverImage != null) {
                return new ValueResponse(coverImage.write());
            } else {
                return new Response(ERROR_NOT_FOUND);
            }
        } catch (UserNotFoundException e) {
            return new Response(ResponseCode.ERROR_USER_NOT_FOUND);
        } catch (IOException e) {
            e.printStackTrace();
            return new Response(Response.ERROR);
        }
    }

    @GetMapping("/{userId}/profile/image")
    public Response image(@PathVariable String userId) {
        try {
            URLData profileImage = accountService.getProfileImage(userId, "47x47");
            if (profileImage != null) {
                return new ValueResponse(profileImage.write());
            } else {
                return new Response(ERROR_NOT_FOUND);
            }
        } catch (UserNotFoundException e) {
            return new Response(ResponseCode.ERROR_USER_NOT_FOUND);
        } catch (IOException e) {
            e.printStackTrace();
            return new Response(Response.ERROR);
        }
    }

    @RequestMapping(value = "/changePassword")
    public @ResponseBody
    Response resetPassword(String password, String passwordConfirm) throws TokenGenerationException, BadCredentialsException {
        try {
            accountService.changePassword(password, passwordConfirm);
        } catch (ValidationException e) {
            e.getValidationResult().getErrors();
            return new Response(Response.ERROR, ErrorsUtils.getAllErrorMessages(e.getValidationResult().getErrors()));
        }
        catch (Exception e) {
            return new Response(Response.ERROR, e.getMessage());
        }
        User user = Security.withMe().getLoggedUser();
        return new ValueResponse(new UIUserWithToken(user, authService.token(((applica._APPNAME_.domain.model.User) user).getMail(), password)));
    }

}
