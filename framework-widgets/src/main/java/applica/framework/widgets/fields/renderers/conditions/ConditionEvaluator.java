package applica.framework.widgets.fields.renderers.conditions;

import applica.framework.widgets.FormField;

/**
 * Created by bimbobruno on 22/10/15.
 */

@FunctionalInterface
public interface ConditionEvaluator {

    boolean evaluate(FormField field, Object value);

}
