package applica._APPNAME_.api.viewmodels;

import applica.framework.security.User;

/**
 * Created by antoniolovicario on 06/11/17.
 */
public class UIUserWithToken {

    private User user;
    private String token;

    public UIUserWithToken(User user, String token) {
        this.user = user;
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
