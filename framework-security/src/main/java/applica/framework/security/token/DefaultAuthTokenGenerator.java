package applica.framework.security.token;

import applica.framework.security.User;
import org.apache.commons.codec.digest.DigestUtils;
import org.jasypt.util.text.BasicTextEncryptor;

import java.util.Calendar;
import java.util.UUID;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 3/21/13
 * Time: 8:31 AM
 */
public class DefaultAuthTokenGenerator implements AuthTokenGenerator {

    public static final String USERNAME_ENCRYPTION_PASSWORD = "_!applica332nuorb$#12";

    private long durationSeconds = TokenExpirationTime.DURATION_IN_SECONDS;
    private long expiration = 0;

    @Override
    public String generate(User user) throws TokenGenerationException {
        if(user == null) {
            throw new TokenGenerationException("user is null");
        }
        return generateTokenWithDuration(user, durationSeconds);
    }

    @Override
    public String generateTokenWithDuration(User user, long durationSeconds) throws TokenGenerationException {
        String token;
        try {
            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.SECOND, (int) durationSeconds);
            if (expiration == 0) {
                expiration = calendar.getTimeInMillis();
            }
            BasicTextEncryptor encryptor = new BasicTextEncryptor();
            encryptor.setPassword(USERNAME_ENCRYPTION_PASSWORD);
            String encryptedUsername = encryptor.encrypt(user.getUsername());
            String data = String.format("%s:%d", user.getPassword(), expiration);

            encryptor = new BasicTextEncryptor();
            String encryptionPassword = DigestUtils.md5Hex(user.getUsername());
            encryptor.setPassword(encryptionPassword);
            String encryptedData = encryptor.encrypt(data);
            token = String.format("%s:%s", encryptedUsername, encryptedData);
        } catch (Exception e) {
            throw new TokenGenerationException(e);
        }

        return token;
    }


    public long getExpiration() {
        return expiration;
    }

    public void setExpiration(long expiration) {
        this.expiration = expiration;
    }

    public long getDurationSeconds() {
        return durationSeconds;
    }

    public void setDurationSeconds(long durationSeconds) {
        this.durationSeconds = durationSeconds;
    }
}
