package applica.framework.security;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 3/20/13
 * Time: 10:34 AM
 */
public class PermissionGrantedAuthority implements org.springframework.security.core.GrantedAuthority {

    private String permission;

    public PermissionGrantedAuthority(String permission) {
        this.permission = permission;
    }

    @Override
    public String getAuthority() {
        return permission;
    }
}
