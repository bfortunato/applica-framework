package applica.integrator.model;

import java.io.IOException;

public class ProcessException extends Exception {

    private ProcessOutput output;

    public ProcessException(ProcessOutput output) {
        this.output = output;
    }

    public ProcessException() {
    }

    public ProcessException(String message) {
        super(message);
    }

    public ProcessException(String message, Throwable cause) {
        super(message, cause);
    }

    public ProcessException(Throwable cause) {
        super(cause);
    }

    public ProcessException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }

    public ProcessOutput getOutput() {
        return output;
    }
}
