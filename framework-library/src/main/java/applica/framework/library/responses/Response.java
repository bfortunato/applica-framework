package applica.framework.library.responses;

/**
 * Responses are used in the framework as ajax calls results
 */
public class Response {
    public static final int OK = 0;
    public static final int ERROR = 1;
    public static final int UNAUTHORIZED = 2;

    private int responseCode;
    private String message;

    public Response() {
        this.responseCode = OK;
    }

    public Response(int responseCode) {
        this.responseCode = responseCode;
    }

    public Response(int responseCode, String message) {
        this.responseCode = responseCode;
        this.message = message;
    }

    public int getResponseCode() {
        return responseCode;
    }

    public void setResponseCode(int responseCode) {
        this.responseCode = responseCode;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
