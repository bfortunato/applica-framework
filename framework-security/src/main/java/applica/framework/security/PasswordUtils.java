package applica.framework.security;

import java.math.BigInteger;
import java.security.SecureRandom;

public class PasswordUtils {

    public static String generateRandom() {
        SecureRandom random = new SecureRandom();
        return new BigInteger(32, random).toString(32);
    }

}
