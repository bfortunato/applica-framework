package applica.framework.widgets.acl;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 03/02/14
 * Time: 15:26
 */
public class CrudAuthorizationException extends Exception {

    public CrudAuthorizationException() {
    }

    public CrudAuthorizationException(String message) {
        super(message);
    }

    public CrudAuthorizationException(String message, Throwable cause) {
        super(message, cause);
    }

    public CrudAuthorizationException(Throwable cause) {
        super(cause);
    }

    public CrudAuthorizationException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
