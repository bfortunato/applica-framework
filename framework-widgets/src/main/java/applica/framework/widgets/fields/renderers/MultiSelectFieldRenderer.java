package applica.framework.widgets.fields.renderers;

import applica.framework.widgets.FormField;
import applica.framework.Entity;
import applica.framework.library.SelectableItem;
import applica.framework.widgets.velocity.VelocityFormFieldRenderer;
import applica.framework.library.utils.TypeUtils;
import org.apache.velocity.VelocityContext;

import java.io.Writer;
import java.util.ArrayList;
import java.util.List;

public abstract class MultiSelectFieldRenderer extends VelocityFormFieldRenderer {

    public abstract List<SelectableItem> getItems(List<? extends Entity> selectedItems);
    private List<SelectableItem> items = new ArrayList<>();

    @Override
    public void render(Writer writer, FormField field, Object value) {
        setTemplatePath("/templates/fields/multi_select.vm");
        if (value != null) {
            if (TypeUtils.isListOfEntities(field.getDataType())) {
                items = getItems((List) value);
            } else {
                items = getItems(new ArrayList());
            }
        } else {
            items = getItems(new ArrayList());
        }
        super.render(writer, field, value);
    }

    @Override
    protected void setupContext(VelocityContext context) {
        super.setupContext(context);

        context.put("items", items);
    }
}
