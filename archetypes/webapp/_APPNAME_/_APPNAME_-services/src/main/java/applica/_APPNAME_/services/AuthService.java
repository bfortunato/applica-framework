package applica._APPNAME_.services;

import applica._APPNAME_.services.exceptions.BadCredentialsException;
import applica.framework.security.token.TokenFormatException;
import applica.framework.security.token.TokenGenerationException;

/**
 * Created by bimbobruno on 15/11/2016.
 */
public interface AuthService {
    /**
     * Executes a login into system and return auth token for rest clients
     * @param mail
     * @param password
     * @return Auth token
     */
    String token(String mail, String password) throws IllegalArgumentException, BadCredentialsException, TokenGenerationException;

    /**
     * Returns a fresh token for current logged user
     * @param currentToken
     * @return
     */
    String freshToken(String currentToken) throws IllegalArgumentException, TokenFormatException, TokenGenerationException, BadCredentialsException;
}
