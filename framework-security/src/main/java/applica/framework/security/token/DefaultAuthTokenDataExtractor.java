package applica.framework.security.token;

import org.jasypt.util.text.BasicTextEncryptor;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 3/21/13
 * Time: 10:58 AM
 */
public class DefaultAuthTokenDataExtractor implements AuthTokenDataExtractor {

    private String getData(String token) throws TokenFormatException {
        String[] split = token.split(":");
        if (split.length < 2) {
            throw new TokenFormatException("invalid token 1");
        }

        BasicTextEncryptor encryptor = new BasicTextEncryptor();
        encryptor.setPassword(split[0]);
        String data = encryptor.decrypt(split[1]);
        return data;
    }

    @Override
    public String getUsername(String token) throws TokenFormatException {
        String[] split = getData(token).split(":");
        if(split.length < 3) {
            throw new TokenFormatException("invalid token 1");
        }

        String username = split[0];

        return username;
    }

    public String getPassword(String token) throws TokenFormatException {
        String[] split = getData(token).split(":");
        if(split.length < 3) {
            throw new TokenFormatException("invalid token 1");
        }

        String password = split[1];

        return password;
    }

    public String getEncryptorPassword(String token) throws TokenFormatException {
        String[] split = token.split(":");
        if (split.length < 2) {
            throw new TokenFormatException("invalid token 1");
        }

        return split[0];
    }

    @Override
    public long getExpiration(String token) throws TokenFormatException {
        String[] split = getData(token).split(":");
        if(split.length < 3) {
            throw new TokenFormatException("invalid token 1");
        }

        long expiration = Long.parseLong(split[2]);

        if(expiration == 0) {
            throw new TokenFormatException("invalid token 2");
        }

        return expiration;
    }
}
