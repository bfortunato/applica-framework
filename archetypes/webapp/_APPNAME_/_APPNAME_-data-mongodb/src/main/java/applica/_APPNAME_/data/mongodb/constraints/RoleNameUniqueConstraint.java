package applica._APPNAME_.data.mongodb.constraints;

import applica._APPNAME_.domain.model.Filters;
import applica._APPNAME_.domain.model.Role;
import applica.framework.LoadRequest;
import applica.framework.data.mongodb.constraints.UniqueConstraint;
import org.springframework.stereotype.Component;

import java.util.function.Function;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 03/11/14
 * Time: 18:18
 */
@Component
public class RoleNameUniqueConstraint extends UniqueConstraint<Role> {

    @Override
    public Class<Role> getType() {
        return Role.class;
    }

    @Override
    public String getProperty() {
        return "role";
    }

    @Override
    protected LoadRequest getOptimizedLoadRequest(Role entity) {
        return LoadRequest.build().eq(Filters.ROLE_NAME, entity.getRole());
    }
}
