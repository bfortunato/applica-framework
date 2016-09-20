package applica._APPNAME_.domain.model;

import applica.framework.AEntity;
import applica.framework.annotations.ManyToMany;
import applica.framework.security.Role;
import org.springframework.util.StringUtils;

import java.util.Date;
import java.util.List;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 28/10/13
 * Time: 17:08
 */
public class User extends AEntity implements applica.framework.security.User {

    private String username;
    private String mail;
    private String password;
    private boolean active;
    private Date registrationDate;
    private String activationCode;
    private String image;

    @ManyToMany
    private List<applica._APPNAME_.domain.model.Role> roles;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getMail() {
        return mail;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public Date getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(Date registrationDate) {
        this.registrationDate = registrationDate;
    }

    public String getActivationCode() {
        return activationCode;
    }

    public void setActivationCode(String activationCode) {
        this.activationCode = activationCode;
    }

    public List<? extends Role> getRoles() {
        return roles;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public void setRoles(List<applica._APPNAME_.domain.model.Role> roles) {
        this.roles = roles;
    }

    public String getInitials() {
        if (StringUtils.hasLength(mail)) {
            return mail.substring(0, 1);
        }

        return "@";
    }

    @Override
    public String toString() {
        return mail;
    }

}
