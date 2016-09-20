package applica.framework.widgets.fields.renderers.conditions;

import applica.framework.widgets.render.FormFieldRenderer;

/**
 * Created by bimbobruno on 22/10/15.
 */
public class FieldRendererCondition {

    private Class<? extends FormFieldRenderer> rendererClass;
    private ConditionEvaluator evaluator;

    public FieldRendererCondition(Class<? extends FormFieldRenderer> rendererClass, ConditionEvaluator evaluator) {
        this.rendererClass = rendererClass;
        this.evaluator = evaluator;
    }

    public Class<? extends FormFieldRenderer> getRendererClass() {
        return rendererClass;
    }

    public void setRendererClass(Class<? extends FormFieldRenderer> rendererClass) {
        this.rendererClass = rendererClass;
    }

    public ConditionEvaluator getEvaluator() {
        return evaluator;
    }

    public void setEvaluator(ConditionEvaluator evaluator) {
        this.evaluator = evaluator;
    }
}
