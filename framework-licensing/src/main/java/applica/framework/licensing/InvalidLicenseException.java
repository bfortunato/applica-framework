package applica.framework.licensing;

/**
 * Created by bimbobruno on 13/10/15.
 */
public class InvalidLicenseException extends Exception {
    public InvalidLicenseException() {
    }

    public InvalidLicenseException(String message) {
        super(message);
    }

    public InvalidLicenseException(String message, Throwable cause) {
        super(message, cause);
    }

    public InvalidLicenseException(Throwable cause) {
        super(cause);
    }
}
