package applica.framework.widgets.operations;

import applica.framework.library.responses.CodedException;

/**
 * Created by bimbobruno on 19/12/2016.
 */
public class OperationException extends CodedException {

    private Object data;
    private String message;

    public OperationException(int errorCode, String message) {
        super(errorCode);
        this.message = message;
    }


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

    @Override
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
