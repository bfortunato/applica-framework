package applica.framework.security.token;

import applica.framework.security.User;
import org.jasypt.util.text.BasicTextEncryptor;
import org.jasypt.util.text.TextEncryptor;
import org.springframework.security.crypto.codec.Base64;

import javax.crypto.Mac;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Calendar;
import java.util.UUID;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 3/21/13
 * Time: 8:31 AM
 */
public class DefaultAuthTokenGenerator implements AuthTokenGenerator {

    private int durationSeconds = 60 * 60; //1 hour by default
    private long expiration = 0;
    private String encryptorPassword = null;

    @Override
    public String generate(User user) throws TokenGenerationException {
        if(user == null) {
            throw new TokenGenerationException("user is null");
        }

        String token;

        try {
            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.SECOND, durationSeconds);
            if (expiration == 0) {
                expiration = calendar.getTimeInMillis();
            }
            String data = String.format("%s:%s:%d", user.getUsername(), user.getPassword(), expiration);
            if (encryptorPassword == null) {
                encryptorPassword = UUID.randomUUID().toString();
            }
            BasicTextEncryptor encryptor = new BasicTextEncryptor();
            encryptor.setPassword(encryptorPassword);
            String encryptedData = encryptor.encrypt(data);
            token = String.format("%s:%s", encryptorPassword, encryptedData);
        } catch (Exception e) {
            throw new TokenGenerationException(e);
        }

        return token;
    }

    public int getDurationSeconds() {
        return durationSeconds;
    }

    public void setDurationSeconds(int durationSeconds) {
        this.durationSeconds = durationSeconds;
    }

    public long getExpiration() {
        return expiration;
    }

    public void setExpiration(long expiration) {
        this.expiration = expiration;
    }

    public String getEncryptorPassword() {
        return encryptorPassword;
    }

    public void setEncryptorPassword(String encryptorPassword) {
        this.encryptorPassword = encryptorPassword;
    }
}
