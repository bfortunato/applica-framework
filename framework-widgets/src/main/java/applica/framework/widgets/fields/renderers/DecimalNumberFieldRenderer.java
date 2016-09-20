package applica.framework.widgets.fields.renderers;

import applica.framework.widgets.Form;
import applica.framework.widgets.FormField;
import org.springframework.stereotype.Component;

/**
 * Created by bimbobruno on 18/09/15.
 */
@Component
public class DecimalNumberFieldRenderer extends TemplateFormFieldRenderer {

    @Override
    protected String createTemplatePath(Form form, FormField formField) {
        return String.format("/templates/fields/decimal_number.vm");
    }

}
