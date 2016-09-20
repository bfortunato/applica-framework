package applica.framework.widgets.fields.renderers;

import applica.framework.widgets.Form;
import applica.framework.widgets.FormField;
import org.springframework.stereotype.Component;

/**
 * Created by antoniolovicario on 13/10/15.
 */
@Component
public class EuroFieldRenderer extends TemplateFormFieldRenderer {

    @Override
    protected String createTemplatePath(Form form, FormField formField) {
        return String.format("/templates/fields/euro.vm");
    }

}
