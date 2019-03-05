package applica._APPNAME_.services.impl;

import applica._APPNAME_.domain.data.UsersRepository;
import applica._APPNAME_.domain.model.User;
import applica._APPNAME_.services.AuthService;
import applica._APPNAME_.services.exceptions.BadCredentialsException;
import applica.framework.security.Security;
import applica.framework.security.token.*;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

/**
 * Created by bimbobruno on 15/11/2016.
 */
@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UsersRepository usersRepository;

    @Override
    public String token(String mail, String password) throws IllegalArgumentException, BadCredentialsException, TokenGenerationException {
        if (StringUtils.isEmpty(mail) || StringUtils.isEmpty(password)) {
            throw new IllegalArgumentException();
        }

        mail = mail.trim();

        if (mail.contains(",")) {
            mail = mail.split(",")[0].trim();
        }

        try {
            Security.manualLogin(mail.toLowerCase().trim(), password);
        } catch (Exception e) {
            throw new BadCredentialsException();
        }

        AuthTokenGenerator generator = new DefaultAuthTokenGenerator();

        User loggedUser = ((User) Security.withMe().getLoggedUser());

        //Password has SHA1 encoding and is stored into DB as SHA1 but token must be generated with a clear password
        //to perform futures password checks so...
        String encryptedPassword = loggedUser.getPassword();
        //set clear password to logged user to generate correct token
        loggedUser.setPassword(password);
        //generate token
        String token = generator.generate(loggedUser);
        //reset encrtpted password to logged user
        loggedUser.setPassword(encryptedPassword);
        //update last login date
        loggedUser.setLastLogin(new Date());
        usersRepository.save(loggedUser);

        return token;
    }

    @Override
    public String freshToken(String currentToken) throws IllegalArgumentException, TokenFormatException, TokenGenerationException, BadCredentialsException {
        if (StringUtils.isEmpty(currentToken)) {
            throw new IllegalArgumentException();
        }

        AuthTokenDataExtractor extractor = new DefaultAuthTokenDataExtractor();
        String username = extractor.getUsername(currentToken);
        String password = extractor.getPassword(currentToken);

        String token = token(username, password);
        return token;
    }
}
