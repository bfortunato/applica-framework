package applica.framework.security.token;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 12/12/14
 * Time: 10:04
 */
public class ByTokenAuthenticationToken extends AbstractAuthenticationToken {


    private String token;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public ByTokenAuthenticationToken(String token) {
        super(null);
        this.token = token;
    }


    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return null;
    }
}
