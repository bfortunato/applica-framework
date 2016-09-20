package applica.framework.widgets.fields.renderers;

import applica.framework.widgets.FormField;
import applica.framework.widgets.fields.renderers.conditions.FieldRendererCondition;
import applica.framework.widgets.render.FormFieldRenderer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

import java.io.Writer;

/**
 * Created by bimbobruno on 22/10/15.
 */
public abstract class ConditionalFieldRenderer implements FormFieldRenderer {

    @Autowired
    private ApplicationContext applicationContext;

    protected abstract FieldRendererCondition[] getConditions();

    @Override
    public void render(Writer writer, FormField field, Object value) {
        FormFieldRenderer renderer = applicationContext.getBean(getRendererClass(field, value));
        renderer.render(writer, field, value);
    }

    protected Class<? extends FormFieldRenderer> getRendererClass(FormField field, Object value) {
        for (FieldRendererCondition c : getConditions()) {
            if (c.getEvaluator().evaluate(field, value)) {
                return c.getRendererClass();
            }
        }

        throw new RuntimeException("No renderer condition was evaluated");
    }
}
