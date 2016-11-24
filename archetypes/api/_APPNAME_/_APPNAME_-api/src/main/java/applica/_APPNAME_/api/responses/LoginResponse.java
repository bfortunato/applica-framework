package applica._APPNAME_.api.responses;

import applica.framework.library.responses.Response;
import applica.framework.security.User;

/**
 * Created by bimbobruno on 14/11/2016.
 */
public class LoginResponse extends Response {

    private String token;
    private User user;

    public LoginResponse(String token, User user) {
        super(Response.OK);
        this.user = user;
        this.token = token;
    }

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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
