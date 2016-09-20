package applica.framework.widgets.fields.renderers;

import applica.framework.widgets.Form;
import applica.framework.widgets.FormField;
import org.apache.velocity.VelocityContext;

import java.util.Date;

public class TimePickerRenderer extends TemplateFormFieldRenderer {

    @Override
    protected String createTemplatePath(Form form, FormField formField) {
        return "/templates/fields/time.vm";
    }

    @Override
    protected void setupContext(VelocityContext context) {

        super.setupContext(context);

        context.put("defaultDate", new Date());
    }
}
