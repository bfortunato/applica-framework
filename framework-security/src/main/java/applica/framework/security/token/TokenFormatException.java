package applica.framework.security.token;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 3/21/13
 * Time: 8:43 AM
 */
public class TokenFormatException extends Exception {

    public TokenFormatException() {
    }

    public TokenFormatException(String message) {
        super(message);
    }

    public TokenFormatException(String message, Throwable cause) {
        super(message, cause);
    }

    public TokenFormatException(Throwable cause) {
        super(cause);
    }

    public TokenFormatException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
