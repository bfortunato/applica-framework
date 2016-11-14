package applica.framework.library.responses;

public class ErrorResponse extends Response {

    private String message;

    public ErrorResponse(String message) {
        super(Response.ERROR);
        this.message = message;
    }

}
