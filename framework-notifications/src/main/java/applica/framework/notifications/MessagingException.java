package applica.framework.notifications;

public class MessagingException extends Exception {

    public MessagingException() {
    }

    public MessagingException(String message) {
        super(message);
    }

    public MessagingException(String message, Throwable cause) {
        super(message, cause);
    }

    public MessagingException(Throwable cause) {
        super(cause);
    }

    public MessagingException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
