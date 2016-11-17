package applica._APPNAME_.data.mongodb.constraints;

import applica._APPNAME_.domain.model.Filters;
import applica._APPNAME_.domain.model.User;
import applica.framework.Query;
import applica.framework.data.mongodb.constraints.UniqueConstraint;
import org.springframework.stereotype.Component;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 03/11/14
 * Time: 18:18
 */
@Component
public class UserMailUniqueConstraint extends UniqueConstraint<User> {

    @Override
    public Class<User> getType() {
        return User.class;
    }

    @Override
    public String getProperty() {
        return "mail";
    }

    @Override
    protected Query getOptimizedQuery(User entity) {
        return Query.build().eq(Filters.USER_MAIL, entity.getMail());
    }
}
