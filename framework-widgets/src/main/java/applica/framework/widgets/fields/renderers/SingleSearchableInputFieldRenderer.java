package applica.framework.widgets.fields.renderers;

import applica.framework.widgets.FormField;
import applica.framework.widgets.velocity.VelocityFormFieldRenderer;
import org.apache.velocity.VelocityContext;

import java.io.Writer;

public abstract class SingleSearchableInputFieldRenderer extends VelocityFormFieldRenderer {

    public abstract String getLabel(FormField field, Object value);

    public abstract String getServiceUrl();

    @Override
    public void render(Writer writer, FormField field, Object value) {
        putExtraContextValue("label", getLabel(field, value));

        super.render(writer, field, value);
    }

    @Override
    protected void setupContext(VelocityContext context) {
        super.setupContext(context);

        context.put("serviceUrl", getServiceUrl());
    }

    @Override
    public String getTemplatePath() {
        return "/templates/fields/single_searchable_input.vm";
    }
}
