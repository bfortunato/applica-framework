package applica.framework.security.token;


import applica.framework.security.User;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 3/21/13
 * Time: 8:29 AM
 */
public interface AuthTokenGenerator {
    String generate(User user) throws TokenGenerationException;
}
