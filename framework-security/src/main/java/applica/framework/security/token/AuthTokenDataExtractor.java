package applica.framework.security.token;

import applica.framework.security.User;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 3/21/13
 * Time: 10:58 AM
 */
public interface AuthTokenDataExtractor {
    String getData(String token) throws TokenFormatException;

    String getUsername(String token) throws TokenFormatException;
    String getPassword(String token) throws TokenFormatException;
    long getExpiration(String token) throws TokenFormatException;
}
