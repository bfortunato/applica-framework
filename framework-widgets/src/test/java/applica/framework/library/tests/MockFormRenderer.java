package applica.framework.library.tests;

import applica.framework.widgets.Form;
import applica.framework.widgets.FormField;
import applica.framework.widgets.render.FormRenderer;

import java.io.Writer;
import java.util.Map;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 03/11/14
 * Time: 11:14
 */
public class MockFormRenderer implements FormRenderer {
    @Override
    public void render(Writer writer, Form form, Map<String, Object> data) {
        for (FormField formField : form.getDescriptor().getFields()) {
            formField.write(writer, data);
        }
    }
}
