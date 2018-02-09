package applica._APPNAME_.domain.model;

import applica.framework.AEntity;

/**
 * Created by antoniolovicario on 06/11/17.
 */
public class PasswordChange extends AEntity{

    private String password;
    private String passwordConfirm;

    public PasswordChange() {}

    public PasswordChange(String password, String passwordConfirm) {
        this.password = password;
        this.passwordConfirm = passwordConfirm;
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
