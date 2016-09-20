package applica._APPNAME_.admin.fields.renderers;

import applica._APPNAME_.domain.model.Role;
import applica.framework.widgets.FormField;
import applica.framework.library.SimpleItem;
import applica.framework.widgets.fields.renderers.MultiSearchableInputFieldRenderer;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 2/26/13
 * Time: 6:09 PM
 */
@Component
public class RolesFieldRenderer extends MultiSearchableInputFieldRenderer {

    @Override
    public String getServiceUrl() {
        return "values/roles";
    }

    @Override
    public List<SimpleItem> getSelectedItems(FormField field, Object value) {
        List<Role> roles = (List<Role>) value;
        if(roles == null) {
            roles = new ArrayList<>();
        }

        return SimpleItem.createList(roles, "role", "id");
    }
}
