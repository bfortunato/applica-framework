package applica.framework.widgets.fields.renderers;

import applica.framework.widgets.Form;
import applica.framework.widgets.FormField;

public class HiddenFieldRenderer extends TemplateFormFieldRenderer {

    @Override
    protected String createTemplatePath(Form form, FormField formField) {
        return "/templates/fields/hidden.vm";
    }

}
