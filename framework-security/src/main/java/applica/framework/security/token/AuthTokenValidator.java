package applica.framework.security.token;

import applica.framework.security.User;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 3/21/13
 * Time: 8:30 AM
 */
public interface AuthTokenValidator {
    void validate(User expectedUser, String token) throws TokenValidationException, TokenFormatException, TokenExpiredException;
    boolean isExpiring(String token) throws TokenValidationException, TokenFormatException, TokenExpiredException;

    boolean isExpired(String token) throws TokenFormatException, TokenExpiredException;
}
