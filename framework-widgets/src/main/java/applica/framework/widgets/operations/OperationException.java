package applica.framework.widgets.operations;

import applica.framework.library.responses.CodedException;

/**
 * Created by bimbobruno on 19/12/2016.
 */
public class OperationException extends CodedException {

    public OperationException(int errorCode, Throwable cause) {
        super(errorCode, cause);
    }

    public OperationException(int errorCode) {
        super(errorCode);
    }
}
