package applica.framework.widgets.fields.renderers;

import applica.framework.AEntity;
import applica.framework.widgets.FormField;
import applica.framework.library.SimpleItem;
import applica.framework.widgets.velocity.VelocityFormFieldRenderer;
import org.apache.velocity.VelocityContext;

import java.io.Writer;
import java.util.List;

public abstract class SelectFieldRenderer extends VelocityFormFieldRenderer {

    public abstract List<SimpleItem> getItems();

    @Override
    public void render(Writer writer, FormField field, Object value) {
        setTemplatePath("/templates/fields/select.vm");
        if (value instanceof AEntity ){
            value = ((AEntity)value).getId();
        }
        super.render(writer, field, value);
    }

    @Override
    protected void setupContext(VelocityContext context) {
        super.setupContext(context);

        context.put("items", getItems());
    }
}
