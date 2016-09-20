package applica._APPNAME_.admin.fields.renderers;

import applica.framework.widgets.FormField;
import applica.framework.library.SimpleItem;
import applica.framework.widgets.fields.renderers.MultiSearchableInputFieldRenderer;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 25/09/14
 * Time: 16:45
 */
@Component
public class PermissionsFieldRenderer extends MultiSearchableInputFieldRenderer {

    @Override
    public String getServiceUrl() {
        return "values/permissions";
    }

    @Override
    public List<SimpleItem> getSelectedItems(FormField formField, Object o) {
        return SimpleItem.createList(Optional.ofNullable((List<String>) o).orElse(new ArrayList<String>()), p -> p, p -> p);
    }
}
