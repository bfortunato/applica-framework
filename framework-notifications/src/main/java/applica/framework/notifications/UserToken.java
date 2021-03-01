package applica.framework.notifications;

import applica.framework.AEntity;

import java.util.Date;

public class UserToken extends AEntity {

    Date tokenLastUpdate;
    Object userId;
    String token;

    public Date getTokenLastUpdate() {
        return tokenLastUpdate;
    }

    public void setTokenLastUpdate(Date tokenLastUpdate) {
        this.tokenLastUpdate = tokenLastUpdate;
    }

    public Object getUserId() {
        return userId;
    }

    public void setUserId(Object userId) {
        this.userId = userId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

}
