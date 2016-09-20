package applica.framework.library.utils;

public class ProgramException extends RuntimeException {

    public ProgramException(String message, Throwable cause) {
        super(message, cause);
    }

    public ProgramException(String message) {
        super(message);
    }

    /**
     *
     */
    private static final long serialVersionUID = -8330383387550147907L;

}
