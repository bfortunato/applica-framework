package applica._APPNAME_.services.exceptions;

/**
 * Created by bimbobruno on 20/05/15.
 */
public class UserNotMeException extends Exception {

    public UserNotMeException() {
    }

    public UserNotMeException(String message) {
        super(message);
    }

    public UserNotMeException(String message, Throwable cause) {
        super(message, cause);
    }

    public UserNotMeException(Throwable cause) {
        super(cause);
    }

    public UserNotMeException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
