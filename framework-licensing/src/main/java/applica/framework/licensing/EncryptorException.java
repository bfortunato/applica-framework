package applica.framework.licensing;

/**
 * Created by bimbobruno on 13/10/15.
 */
public class EncryptorException extends Exception {
    public EncryptorException() {
    }

    public EncryptorException(String message) {
        super(message);
    }

    public EncryptorException(String message, Throwable cause) {
        super(message, cause);
    }

    public EncryptorException(Throwable cause) {
        super(cause);
    }

    public EncryptorException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
