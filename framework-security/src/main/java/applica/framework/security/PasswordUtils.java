package applica.framework.security;

import org.apache.commons.lang3.StringUtils;
import org.jsoup.helper.StringUtil;

import java.math.BigInteger;
import java.security.SecureRandom;

public class PasswordUtils {

    public static String generateRandom() {
        SecureRandom random = new SecureRandom();
        return new BigInteger(32, random).toString(32);
    }

    public static boolean isValid(String password) {
        if (StringUtils.isEmpty(password)) {
            return false;
        }

        return password.length() > 5;
    }

}
