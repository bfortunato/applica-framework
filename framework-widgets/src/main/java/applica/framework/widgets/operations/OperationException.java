package applica.framework.widgets.operations;

import applica.framework.library.responses.CodedException;

/**
 * Created by bimbobruno on 19/12/2016.
 */
public class OperationException extends CodedException {

    private Object data;

    public OperationException(int errorCode, Throwable cause) {
        super(errorCode, cause);
    }

    public OperationException(int errorCode, Throwable cause, Object data) {
        super(errorCode, cause);
        this.data = data;
    }

    public OperationException(int errorCode) {
        super(errorCode);
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
