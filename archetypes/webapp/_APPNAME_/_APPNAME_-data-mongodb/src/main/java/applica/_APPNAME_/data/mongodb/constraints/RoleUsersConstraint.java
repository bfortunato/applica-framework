package applica._APPNAME_.data.mongodb.constraints;

import applica._APPNAME_.domain.model.Filters;
import applica._APPNAME_.domain.model.Role;
import applica._APPNAME_.domain.model.User;
import applica.framework.LoadRequest;
import applica.framework.data.mongodb.constraints.ForeignKeyConstraint;
import org.springframework.stereotype.Component;

import java.util.function.Function;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 03/11/14
 * Time: 17:10
 */
@Component
public class RoleUsersConstraint extends ForeignKeyConstraint<Role, User> {

    @Override
    public Class<Role> getPrimaryType() {
        return Role.class;
    }

    @Override
    public Class<User> getForeignType() {
        return User.class;
    }

    @Override
    public String getForeignProperty() {
        return "roles";
    }

    @Override
    protected LoadRequest getOptimizedLoadRequest(Role primaryEntity) {
        return LoadRequest.build().eq(Filters.USER_ROLES_ID, primaryEntity.getId());
    }
}
