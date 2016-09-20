package applica.framework.widgets.fields.renderers;

import applica.framework.widgets.Form;
import applica.framework.widgets.FormField;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 11/09/14
 * Time: 19:58
 */
public class HtmlFieldRenderer extends TemplateFormFieldRenderer {

    @Override
    protected String createTemplatePath(Form form, FormField formField) {
        return "/templates/fields/html.vm";
    }

}
