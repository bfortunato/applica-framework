package applica.framework.security.token;

import applica.framework.security.User;
import org.springframework.security.crypto.codec.Base64;
import org.springframework.util.StringUtils;

import javax.crypto.Mac;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Date;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 3/21/13
 * Time: 8:54 AM
 */
public class DefaultAuthTokenValidator implements AuthTokenValidator {

    public static final long EXPIRING_TIME = 5 * 60 * 1000; //five minutes

    @Override
    public void validate(User expectedUser, String token) throws TokenValidationException, TokenFormatException, TokenExpiredException {
        if(!StringUtils.hasLength(token)) {
            throw new TokenValidationException("token is null");
        }

        if(expectedUser == null) {
            throw new TokenValidationException("expectedUser is null");
        }

        String expectedToken;

        try {
            AuthTokenDataExtractor extractor = new DefaultAuthTokenDataExtractor();
            long expiration = extractor.getExpiration(token);

            Date now = new Date();
            if (now.getTime() > expiration) {
                throw new TokenExpiredException();
            }

            String username = extractor.getUsername(token);
            String password = extractor.getPassword(token);

            if (!expectedUser.getUsername().toLowerCase().equals(username.toLowerCase())) {
                throw new TokenValidationException("username");
            }

            if (!expectedUser.getPassword().equals(password)) {
                throw new TokenValidationException("password");
            }

        } catch (Exception e) {
            throw new TokenValidationException(e);
        }
    }

    @Override
    public boolean isExpiring(String token) throws TokenFormatException, TokenExpiredException {
        if (!StringUtils.hasLength(token)) {
            throw new TokenFormatException("token is null");
        }

        DefaultAuthTokenDataExtractor extractor = new DefaultAuthTokenDataExtractor();
        long expiration = extractor.getExpiration(token);

        Date now = new Date();
        if (now.getTime() > expiration) {
            throw new TokenExpiredException();
        }

        return now.getTime() > (expiration - EXPIRING_TIME);
    }

    @Override
    public boolean isExpired(String token) throws TokenFormatException, TokenExpiredException {
        if (!StringUtils.hasLength(token)) {
            throw new TokenFormatException("token is null");
        }

        DefaultAuthTokenDataExtractor extractor = new DefaultAuthTokenDataExtractor();
        long expiration = extractor.getExpiration(token);

        Date now = new Date();
        if (now.getTime() > expiration) {
            throw new TokenExpiredException();
        }

        return now.getTime() > (expiration);
    }

}
