package applica.framework.widgets.fields.renderers;


import applica.framework.Entity;
import applica.framework.widgets.FormField;
import applica.framework.widgets.render.FormFieldRenderer;
import applica.framework.library.utils.TypeUtils;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.Writer;
import java.lang.reflect.ParameterizedType;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 03/11/14
 * Time: 15:31
 */
public class FieldRendererWrapper implements FormFieldRenderer {

    @Autowired
    private BasicTypesFieldRenderer basicTypesFieldRenderer;

    @Autowired
    private DefaultEntityMultiSelectFieldRenderer entityMultiSelectFieldRenderer;

    @Autowired
    private DefaultEntitySelectFieldRenderer entitySelectFieldRenderer;

    @Override
    public void render(Writer writer, FormField field, Object value) {
        if (TypeUtils.isListOfEntities(field.getDataType())) {
            entityMultiSelectFieldRenderer.setEntityType((Class<? extends Entity>) TypeUtils.getFirstGenericArgumentType((ParameterizedType) field.getDataType()));
            entityMultiSelectFieldRenderer.render(writer, field, value);
        } else if (TypeUtils.isEntity(field.getDataType())) {
            entitySelectFieldRenderer.setEntityType((Class<? extends Entity>) field.getDataType());
            entitySelectFieldRenderer.render(writer, field, value);
        } else {
            basicTypesFieldRenderer.render(writer, field, value);
        }
    }
}
