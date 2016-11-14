package applica._APPNAME_.admin.responses;

import applica.framework.library.responses.Response;

/**
 * Created by bimbobruno on 14/11/2016.
 */
public class LoginResponse extends Response {

    private String token;

    public LoginResponse(String token) {
        super(Response.OK);
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
