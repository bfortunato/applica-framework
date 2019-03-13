package applica._APPNAME_.domain.model;

import applica.framework.AEntity;

/**
 * Created by antoniolovicario on 06/11/17.
 */
public class PasswordChange extends AEntity{

    private User user;
    private String password;
    private String passwordConfirm;

    public PasswordChange() {}

    public PasswordChange(User user, String password, String passwordConfirm) {
        this.user = user;
        this.password = password;
        this.passwordConfirm = passwordConfirm;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getPasswordConfirm() {
        return passwordConfirm;
    }

    public void setPasswordConfirm(String passwordConfirm) {
        this.passwordConfirm = passwordConfirm;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
