package applica._APPNAME_.domain.model;

import applica.framework.AEntity;

public class PasswordRecoveryCode extends AEntity {

    private String userId;
    private String code;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}