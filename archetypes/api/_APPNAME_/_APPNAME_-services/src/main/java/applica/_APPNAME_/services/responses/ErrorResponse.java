package applica._APPNAME_.services.responses;

import applica.framework.library.responses.Response;

/**
 * Created by bimbobruno on 19/05/2017.
 */
public class ErrorResponse extends Response {

    private final Object data;

    public ErrorResponse(int responseCode, Object data) {
        super(responseCode, null);
        this.data = data;
    }

    public Object getData() {
        return data;
    }
}
