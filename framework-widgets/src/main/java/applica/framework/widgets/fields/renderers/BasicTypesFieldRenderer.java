package applica.framework.widgets.fields.renderers;

import applica.framework.widgets.Form;
import applica.framework.widgets.FormField;
import applica.framework.library.utils.TypeUtils;

public class BasicTypesFieldRenderer extends TemplateFormFieldRenderer {

    @Override
    protected String createTemplatePath(Form form, FormField formField) {
        String templateType = TypeUtils.getRawClassFromGeneric(formField.getDataType()).getSimpleName().toLowerCase();
        String templateFile = null;

        switch (templateType) {
            case "double":
            case "float":
                templateFile = "decimal_number";
                break;
            case "integer":
            case "int":
            case "long":
                templateFile = "number";
                break;
            case "date":
                templateFile = "datetime";
                break;
            case "boolean":
                templateFile = "check";
                break;
            default:
                templateFile = "text";
                break;
        }

        return String.format("/templates/fields/%s.vm", templateFile);
    }
}
