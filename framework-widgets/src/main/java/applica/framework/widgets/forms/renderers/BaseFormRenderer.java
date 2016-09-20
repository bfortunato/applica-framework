package applica.framework.widgets.forms.renderers;

import applica.framework.widgets.Form;
import applica.framework.widgets.velocity.VelocityFormRenderer;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.Writer;
import java.util.Map;

public class BaseFormRenderer extends VelocityFormRenderer {
    private Log logger = LogFactory.getLog(getClass());

    @Override
    public void render(Writer writer, Form form, Map<String, Object> data) {
        String templatePath = createTemplatePath(form);
        setTemplatePath(templatePath);

        logger.info("Loading form template: " + templatePath);

        super.render(writer, form, data);
    }

    protected String createTemplatePath(Form form) {
        String templatePath = "/templates/form.vm";

        return templatePath;
    }

}
