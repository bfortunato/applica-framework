package applica.framework.widgets.processors;

/**
 * Created by bimbobruno on 19/12/2016.
 */
public class FormProcessException extends Exception {
    public FormProcessException() {
    }

    public FormProcessException(String message) {
        super(message);
    }

    public FormProcessException(String message, Throwable cause) {
        super(message, cause);
    }

    public FormProcessException(Throwable cause) {
        super(cause);
    }

    public FormProcessException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
