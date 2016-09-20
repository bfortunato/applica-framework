package applica.framework.widgets.fields.renderers;

import applica.framework.widgets.FormField;
import applica.framework.library.SimpleItem;
import applica.framework.widgets.velocity.VelocityFormFieldRenderer;
import org.apache.velocity.VelocityContext;

import java.io.Writer;
import java.util.List;

public abstract class MultiSearchableInputFieldRenderer extends VelocityFormFieldRenderer {

    public abstract String getServiceUrl();

    public abstract List<SimpleItem> getSelectedItems(FormField field, Object value);

    @Override
    public void render(Writer writer, FormField field, Object value) {
        setTemplatePath("/templates/fields/multi_searchable_input.vm");
        List<SimpleItem> items = getSelectedItems(field, value);
        putExtraContextValue("selectedItems", items);

        super.render(writer, field, value);
    }

    @Override
    protected void setupContext(VelocityContext context) {
        super.setupContext(context);

        context.put("serviceUrl", getServiceUrl());
    }
}
