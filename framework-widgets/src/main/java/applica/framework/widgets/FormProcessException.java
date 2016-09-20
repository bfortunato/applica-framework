package applica.framework.widgets;

public class FormProcessException extends Exception {

    /**
     *
     */
    private static final long serialVersionUID = 6057992326703818965L;

    public FormProcessException() {
        super();
    }

    public FormProcessException(String message, Throwable cause,
                                boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }

    public FormProcessException(String message, Throwable cause) {
        super(message, cause);
    }

    public FormProcessException(String message) {
        super(message);
    }

    public FormProcessException(Throwable cause) {
        super(cause);
    }


}
