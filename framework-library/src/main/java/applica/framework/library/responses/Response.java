package applica.framework.library.responses;

/**
 * Responses are used in the framework as ajax calls results
 */
public class Response {
    public static final int OK = 0;
    public static final int ERROR = 1;

    private int responseCode;

    public Response() {
        this.responseCode = OK;
    }

    public Response(int responseCode) {
        this.responseCode = responseCode;
    }

    public int getResponseCode() {
        return responseCode;
    }

    public void setResponseCode(int responseCode) {
        this.responseCode = responseCode;
    }
}
