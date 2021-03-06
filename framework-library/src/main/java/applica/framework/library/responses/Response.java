package applica.framework.library.responses;

import applica.framework.library.utils.Nulls;

/**
 * Responses are used in the framework as ajax calls results
 */
public class Response {
    public static final int OK = 0;
    public static final int ERROR = 1;
    public static final int UNAUTHORIZED = 2;
    public static final int ERROR_SERIALIZATION = 3;
    public static final int ERROR_NOT_FOUND = 4;
    public static final int ERROR_CONSTRAINT_VIOLATION = 5;
    public static final int ERROR_VALIDATION = 6;

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

    public static Response ok() {
        return new Response(OK);
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
