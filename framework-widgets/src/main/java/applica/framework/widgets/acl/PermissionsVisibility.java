package applica.framework.widgets.acl;

import applica.framework.security.Security;
import applica.framework.widgets.Form;
import applica.framework.widgets.FormField;
import applica.framework.widgets.Grid;
import applica.framework.widgets.GridColumn;
import applica.framework.widgets.fields.Params;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Created by bimbobruno on 15/09/15.
 */
public class PermissionsVisibility implements Visibility {

    public static final String WIDGET_GRID = "grid";
    public static final String WIDGET_FORM = "form";

    public static final String ACTION_EDIT = "edit";
    public static final String ACTION_VIEW = "view";

    public static final String BEHAVIOR_ALL_VISIBLE_BUT = "all_visible_but";
    public static final String BEHAVIOR_ALL_INVISIBLE_BUT = "all_invisible_but";


    @Autowired
    private Security security;

    private String behavior = BEHAVIOR_ALL_VISIBLE_BUT;

    private String namingFormat = "{widget}:{entity}:{property}:{action}";

    @Override
    public boolean isColumnVisible(Grid grid, String property) {
        GridColumn column = grid.getDescriptor().getColumns().stream().filter(c -> c.getProperty().equals(property)).findFirst().orElseThrow(() -> new RuntimeException(property));
        String permission = column.getParam(Params.COLUMN_VISIBILITY_PERMISSION);

        if (behavior.equals(BEHAVIOR_ALL_INVISIBLE_BUT)) {
            if (StringUtils.isEmpty(permission)) {
                permission = getDefaultPermissionName(grid.getIdentifier(), property, WIDGET_GRID);
            }
        }

        if (StringUtils.isEmpty(permission)) {
            if (behavior.equals(BEHAVIOR_ALL_INVISIBLE_BUT)) {
                throw new RuntimeException(property);
            } else if (behavior.equals(BEHAVIOR_ALL_VISIBLE_BUT)) {
                return true;
            }
        }

        return security.withMe().isPermitted(permission);
    }

    @Override
    public boolean isFieldVisible(Form form, String property) {
        FormField field = form.getDescriptor().getFields().stream().filter(c -> c.getProperty().equals(property)).findFirst().orElseThrow(() -> new RuntimeException(property));
        String permission = field.getParam(Params.FIELD_VISIBILITY_PERMISSION);

        if (behavior.equals(BEHAVIOR_ALL_INVISIBLE_BUT)) {
            if (StringUtils.isEmpty(permission)) {
                permission = getDefaultPermissionName(form.getIdentifier(), property, WIDGET_FORM);
            }
        }

        if (StringUtils.isEmpty(permission)) {
            if (behavior.equals(BEHAVIOR_ALL_INVISIBLE_BUT)) {
                throw new RuntimeException(property);
            } else if (behavior.equals(BEHAVIOR_ALL_VISIBLE_BUT)) {
                return true;
            }
        }

        return security.withMe().isPermitted(permission);
    }

    private String getDefaultPermissionName(String entity, String property, String widget) {
        String action = null;
        if (WIDGET_FORM.equals(widget)) {
            action = ACTION_EDIT;
        } else {
            action = ACTION_VIEW;
        }

        return namingFormat
                .replace("{entity}", entity)
                .replace("{property}", property)
                .replace("{widget}", widget)
                .replace("{action}", action);

    }

    public String getBehavior() {
        return behavior;
    }

    public void setBehavior(String behavior) {
        this.behavior = behavior;
    }

    public String getNamingFormat() {
        return namingFormat;
    }

    public void setNamingFormat(String namingFormat) {
        this.namingFormat = namingFormat;
    }
}
