package applica._APPNAME_.domain.model;


import applica.framework.AEntity;

import java.util.Date;

public class UserPassword extends AEntity {
    /**
     * Rappresenta un record dello storico password dell'utente
     */
    private String userId;
    private String password; //password precedentemente impsotata (criptata)
    private Date creationDate = new Date();

    public UserPassword() {}

    public UserPassword(String previousPassword, String userId) {
        this.password = previousPassword;
        this.userId = userId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }
}
