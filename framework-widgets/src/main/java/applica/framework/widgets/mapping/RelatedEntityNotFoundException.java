package applica.framework.widgets.mapping;

/**
 * Created by bimbobruno on 14/02/2017.
 */
public class RelatedEntityNotFoundException extends Exception {

    public RelatedEntityNotFoundException() {
    }

    public RelatedEntityNotFoundException(String message) {
        super(message);
    }

    public RelatedEntityNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public RelatedEntityNotFoundException(Throwable cause) {
        super(cause);
    }

    public RelatedEntityNotFoundException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
