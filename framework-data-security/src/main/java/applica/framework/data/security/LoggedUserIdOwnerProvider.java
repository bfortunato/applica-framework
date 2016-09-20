package applica.framework.data.security;

import applica.framework.Entity;
import applica.framework.security.Security;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

/**
 * Created by bimbobruno on 17/09/15.
 */
public class LoggedUserIdOwnerProvider implements OwnerProvider {

    @Autowired
    private Security security;

    @Override
    public Object provide() {
        Entity user = ((Entity) security.withMe().getLoggedUser());
        Assert.notNull(user, "User must be logged in and must be an entity");

        return user.getId();
    }
}
