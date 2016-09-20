package applica.framework.security;

import org.springframework.security.core.userdetails.UserDetails;

public interface UserDetailsRepository {
    UserDetails getByMail(String mail);
}
