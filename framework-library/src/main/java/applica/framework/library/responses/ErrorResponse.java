package applica.framework.library.responses;

public class ErrorResponse extends SimpleResponse {

    public ErrorResponse(String error) {
        super();

        setError(true);
        setMessage(error);
    }

}
