package applica.framework.widgets.factory;

import applica.framework.Entity;
import applica.framework.widgets.processors.FormProcessor;

/**
 * Created by bimbobruno on 24/01/2017.
 */
public interface FormProcessorFactory {
    FormProcessor create(Class<? extends Entity> entityType);
}
