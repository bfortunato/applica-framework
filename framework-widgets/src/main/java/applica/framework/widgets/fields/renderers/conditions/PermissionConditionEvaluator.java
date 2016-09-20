package applica.framework.widgets.fields.renderers.conditions;

import applica.framework.security.Security;
import applica.framework.security.User;
import applica.framework.widgets.FormField;

/**
 * Created by bimbobruno on 22/10/15.
 */
public class PermissionConditionEvaluator implements ConditionEvaluator {

    private String permission;
    private User user;

    public PermissionConditionEvaluator(String permission) {
        this.permission = permission;
    }

    public PermissionConditionEvaluator(User user, String permission) {
        this.user = user;
        this.permission = permission;
    }

    public String getPermission() {
        return permission;
    }

    public void setPermission(String permission) {
        this.permission = permission;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public boolean evaluate(FormField field, Object value) {
        if (user != null) {
            return Security.with(user).isPermitted(permission);
        } else {
            return Security.withMe().isPermitted(permission);
        }
    }

}
