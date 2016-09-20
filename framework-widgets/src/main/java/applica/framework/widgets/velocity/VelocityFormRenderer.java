package applica.framework.widgets.velocity;

import applica.framework.library.velocity.VelocityBuilderProvider;
import applica.framework.library.velocity.VelocityRenderer;
import applica.framework.widgets.Form;
import applica.framework.widgets.render.FormRenderer;
import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.springframework.util.StringUtils;

import java.io.Writer;
import java.util.Map;

public class VelocityFormRenderer extends VelocityRenderer implements FormRenderer {

    public VelocityFormRenderer() {
        super();
    }

    public VelocityFormRenderer(String templatePath) {
        super();
        setTemplatePath(templatePath);
    }

    @Override
    public void render(Writer writer, Form form, Map<String, Object> data) {
        if (!StringUtils.hasLength(getTemplatePath())) return;

        Template template = VelocityBuilderProvider.provide().engine().getTemplate(getTemplatePath(), "UTF-8");
        VelocityContext context = new VelocityContext();
        context.put("writer", writer);
        context.put("data", data);
        context.put("form", form);
        context.put("fields", form.getDescriptor().getFields());

        setupContext(context);

        template.merge(context, writer);
    }

}
