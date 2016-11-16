package applica._APPNAME_.services.exceptions;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 12/12/14
 * Time: 12:27
 */
public class RegistrationException extends Exception {
    public RegistrationException() {
    }

    public RegistrationException(String message) {
        super(message);
    }

    public RegistrationException(String message, Throwable cause) {
        super(message, cause);
    }

    public RegistrationException(Throwable cause) {
        super(cause);
    }

    public RegistrationException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
