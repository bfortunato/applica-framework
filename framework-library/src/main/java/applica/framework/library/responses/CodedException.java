package applica.framework.library.responses;

/**
 * Created by bimbobruno on 27/02/2017.
 */
public class CodedException extends Exception {

    private final int errorCode;

    public CodedException(int errorCode) {
        this.errorCode = errorCode;
    }

    public CodedException(int errorCode, Throwable cause) {
        super(cause);
        this.errorCode = errorCode;
    }

    public int getErrorCode() {
        return errorCode;
    }

}
