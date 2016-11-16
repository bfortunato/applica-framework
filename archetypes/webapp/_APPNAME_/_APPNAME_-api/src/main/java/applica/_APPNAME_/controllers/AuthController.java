package applica._APPNAME_.controllers;

import applica._APPNAME_.responses.LoginResponse;
import applica._APPNAME_.services.AuthService;
import applica._APPNAME_.services.exceptions.BadCredentialsException;
import applica.framework.library.i18n.controllers.LocalizedController;
import applica.framework.library.responses.Response;
import applica.framework.security.token.TokenFormatException;
import applica.framework.security.token.TokenGenerationException;
import org.apache.catalina.servlet4preview.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import static applica._APPNAME_.responses.ResponseCode.*;
import static applica.framework.library.responses.Response.*;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 3/19/2016
 * Time: 4:22 PM
 */
@RestController
@RequestMapping("/auth")
public class AuthController extends LocalizedController {

    @Autowired
    private AuthService authService;

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public Response login(String mail, String password) {
        try {
            String token = authService.token(mail, password);
            return new LoginResponse(token);
        } catch (BadCredentialsException e) {
            return new Response(ERROR_BAD_CREDENTIALS);
        } catch (TokenGenerationException e) {
            return new Response(ERROR_TOKEN_GENERATION);
        } catch (Exception e) {
            return new Response(ERROR);
        }
    }

    @RequestMapping(value = "/freshToken", method = RequestMethod.GET)
    @PreAuthorize("isAuthenticated()")
    public Response freshToken(HttpServletRequest request) {
        try {
            String currentToken = request.getHeader("TOKEN");
            String token = authService.freshToken(currentToken);
            return new LoginResponse(token);
        } catch (TokenGenerationException e) {
            return new Response(ERROR_TOKEN_GENERATION);
        } catch (TokenFormatException e) {
            return new Response(ERROR_TOKEN_FORMAT);
        } catch (BadCredentialsException e) {
            return new Response(ERROR_BAD_CREDENTIALS);
        } catch (Exception e) {
            return new Response(ERROR);
        }
    }

}
