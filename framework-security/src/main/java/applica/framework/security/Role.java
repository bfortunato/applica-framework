package applica.framework.security;

import java.util.List;

public interface Role {

    String getRole();
    List<String> getPermissions();

}
