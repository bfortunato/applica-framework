package applica._APPNAME_.domain.model;

import applica.framework.AEntity;
import applica.framework.widgets.entities.EntityId;

import java.util.ArrayList;
import java.util.List;

/**
 * Applica
 * User: bimbobruno
 * Date: 3/3/13
 * Time: 10:46 PM
 */
@EntityId(EntityList.ROLE)
public class Role extends AEntity implements applica.framework.security.Role {

    public static final String ADMIN = "admin";
    public static final String USER = "user";

    private String role;
    private List<String> permissions = new ArrayList<>();

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @Override
    public List<String> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<String> permissions) {
        this.permissions = permissions;
    }

    @Override
    public String toString() {
        return role;
    }

    public static List<String> getAllRoles() {
        return Arrays.asList(ADMIN, USER);
    }
}
