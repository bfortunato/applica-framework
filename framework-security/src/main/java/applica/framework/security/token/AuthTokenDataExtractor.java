package applica.framework.security.token;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 3/21/13
 * Time: 10:58 AM
 */
public interface AuthTokenDataExtractor {
    String getUsername(String token) throws TokenFormatException;
    String getPassword(String token) throws TokenFormatException;
    String getEncryptorPassword(String token) throws TokenFormatException;
    long getExpiration(String token) throws TokenFormatException;
}
