package applica.framework.widgets.fields.renderers;

import applica.framework.library.i18n.Localization;
import applica.framework.widgets.Form;
import applica.framework.widgets.FormField;
import applica.framework.widgets.velocity.VelocityFormFieldRenderer;
import org.apache.velocity.VelocityContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.WebApplicationContext;

import java.io.Writer;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 03/11/14
 * Time: 16:32
 */
public abstract class TemplateFormFieldRenderer extends VelocityFormFieldRenderer {

    @Autowired
    protected WebApplicationContext webApplicationContext;

    protected abstract String createTemplatePath(Form form, FormField formField);

    @Override
    public void render(Writer writer, FormField formField, Object value) {
        String templatePath = createTemplatePath(formField.getForm(), formField);

        setTemplatePath(templatePath);

        super.render(writer, formField, value);
    }

    @Override
    protected void setupContext(VelocityContext context) {
        super.setupContext(context);

        Localization localization = new Localization(webApplicationContext);
        context.put("localization", localization);
        context.put("wwwBase", webApplicationContext.getServletContext().getContextPath());
    }

}
