package applica.framework.licensing;

/**
 * Created by bimbobruno on 13/10/15.
 */
public class LicenseGenerationException extends Exception {
    public LicenseGenerationException() {
    }

    public LicenseGenerationException(String message) {
        super(message);
    }

    public LicenseGenerationException(String message, Throwable cause) {
        super(message, cause);
    }

    public LicenseGenerationException(Throwable cause) {
        super(cause);
    }

    public LicenseGenerationException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
