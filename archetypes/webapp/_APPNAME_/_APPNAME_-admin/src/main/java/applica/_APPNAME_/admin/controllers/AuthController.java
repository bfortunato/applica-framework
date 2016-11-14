package applica._APPNAME_.admin.controllers;

import applica._APPNAME_.admin.responses.LoginResponse;
import applica._APPNAME_.domain.data.UsersRepository;
import applica._APPNAME_.domain.model.User;
import applica.framework.library.i18n.controllers.LocalizedController;
import applica.framework.library.responses.ErrorResponse;
import applica.framework.library.responses.Response;
import applica.framework.security.AuthenticationException;
import applica.framework.security.Security;
import applica.framework.security.token.AuthTokenGenerator;
import applica.framework.security.token.DefaultAuthTokenGenerator;
import applica.framework.security.token.TokenGenerationException;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 3/19/2016
 * Time: 4:22 PM
 */
@RequestMapping("/auth")
public class AuthController extends LocalizedController {

    @Autowired
    private RequestCache requestCache;

    @Autowired
    private UsersRepository usersRepository;

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public Response login(String mail, String password, String deviceType, String deviceUdid, HttpServletRequest request, HttpServletResponse response) {
        requestCache.removeRequest(request, response);

        if (StringUtils.isEmpty(mail) || StringUtils.isEmpty(password)) {
            return new ErrorResponse("error.login.missing");
        }

        mail = mail.trim();

        if (mail.contains(",")) {
            mail = mail.split(",")[0].trim();
        }

        try {
            Security.manualLogin(mail.toLowerCase().trim(), password);
        } catch (AuthenticationException e) {
            return new ErrorResponse("error.login.bad");
        }

        AuthTokenGenerator generator = new DefaultAuthTokenGenerator();
        try {
            User loggedUser = ((User) Security.withMe().getLoggedUser());

            //Password has MD5 encoding and is stored into DB as MD5 but token must be generated with a clear password
            //to perform futures password checks so...
            String md5Password = loggedUser.getPassword();
            //set clear password to logged user to generate correct token
            loggedUser.setPassword(password);
            //generate token
            String token = generator.generate(loggedUser);
            //reset md5 password to logged user
            loggedUser.setPassword(md5Password);
            //update last login date
            loggedUser.setLastLogin(new Date());
            usersRepository.save(loggedUser);

            //return token to clients
            return new LoginResponse(token);
        } catch (TokenGenerationException e) {
            return new ErrorResponse("error.login.token");
        }
    }

    @RequestMapping(value = "/freshToken", method = RequestMethod.GET)
    @PreAuthorize("isAuthenticated()")
    public Response freshToken() {
        AuthTokenGenerator generator = new DefaultAuthTokenGenerator();
        try {
            return new LoginResponse(generator.generate(Security.withMe().getLoggedUser()));
        } catch (TokenGenerationException e) {
            return new ErrorResponse("error.login.token");
        }
    }

}
