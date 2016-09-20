package applica.framework.security;

import applica.framework.Entity;
import org.springframework.security.core.GrantedAuthority;

import java.util.ArrayList;
import java.util.Collection;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 3/20/13
 * Time: 10:33 AM
 */
public abstract class UserDetailsImpl implements org.springframework.security.core.userdetails.UserDetails, Entity {

    private User user;
    private Collection<PermissionGrantedAuthority> authorities;

    public UserDetailsImpl(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (user.getRoles() != null) {
            if (authorities == null) {
                authorities = new ArrayList<>();
                if (user.getRoles() != null) {
                    user.getRoles().forEach((r) -> {
                        if (r.getPermissions() != null) {
                            r.getPermissions().forEach((p) -> authorities.add(new PermissionGrantedAuthority(p)));
                        }
                    });
                }
            }
        }

        return authorities;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return user.isActive();
    }

    @Override
    public boolean isAccountNonLocked() {
        return user.isActive();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return user.isActive();
    }

    @Override
    public boolean isEnabled() {
        return user.isActive();
    }

    public User getUser() {
        return user;
    }
}
