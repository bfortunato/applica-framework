package applica.framework.widgets.fields.renderers;

import applica.framework.widgets.FormField;
import applica.framework.library.SelectableItem;
import applica.framework.widgets.velocity.VelocityFormFieldRenderer;

import java.io.Writer;
import java.util.List;

public abstract class CheckboxesFieldRenderer extends VelocityFormFieldRenderer {

    public abstract List<SelectableItem> getItems(FormField field, Object value);

    @Override
    public void render(Writer writer, FormField field, Object value) {
        setTemplatePath("/templates/fields/checkboxes.vm");
        putExtraContextValue("items", getItems(field, value));

        super.render(writer, field, value);
    }
}
