package applica.framework.widgets.forms.renderers;

import applica.framework.widgets.Form;
import applica.framework.widgets.FormField;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.velocity.VelocityContext;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.util.StringUtils;

import java.io.Writer;
import java.util.Map;

public class SearchFormRenderer extends BaseFormRenderer {

    private Form form;

    @Override
    public void render(Writer writer, Form form, Map<String, Object> data) {
        this.form = form;

        super.render(writer, form, data);
    }

    @Override
    protected String createTemplatePath(Form form) {
        String templatePath = "/templates/searchForm.vm";
        return templatePath;
    }

    @Override
    protected void setupContext(VelocityContext context) {
        super.setupContext(context);

        ObjectMapper mapper = new ObjectMapper();
        ObjectNode node = mapper.createObjectNode();
        for(FormField field : form.getDescriptor().getFields()) {
            if(StringUtils.hasLength(field.getSearchCriteria())) {
                node.put(field.getProperty(), field.getSearchCriteria());
            }
        }
        context.put("criterias", node.toString());
    }
}
