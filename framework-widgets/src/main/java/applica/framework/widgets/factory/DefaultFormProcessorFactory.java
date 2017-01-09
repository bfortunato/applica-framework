package applica.framework.widgets.factory;

import applica.framework.Entity;
import applica.framework.widgets.processors.DefaultFormProcessor;
import applica.framework.widgets.processors.FormProcessor;
import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

import java.util.HashMap;

/**
 * Created by bimbobruno on 19/12/2016.
 */
public class DefaultFormProcessorFactory implements FormProcessorFactory {

    @Autowired
    private ApplicationContext applicationContext;

    private HashMap<Class<? extends Entity>, DefaultFormProcessor> defaultFormProcessors = new HashMap<>();

    @Override
    public FormProcessor create(Class<? extends Entity> entityType) {
        FormProcessor formProcessor = null;

        try {
            formProcessor = applicationContext.getBeansOfType(FormProcessor.class).values().stream()
                    .filter(r -> !(r instanceof DefaultFormProcessor))
                    .filter(r -> r.getEntityType().equals(entityType))
                    .findFirst()
                    .orElseThrow(() -> new NoSuchBeanDefinitionException("form processor " + entityType.getName()));
        } catch (NoSuchBeanDefinitionException e) {
            if (defaultFormProcessors.containsKey(entityType)) {
                return defaultFormProcessors.get(entityType);
            }

            formProcessor = applicationContext.getBean(DefaultFormProcessor.class);
            ((DefaultFormProcessor) formProcessor).setEntityType(entityType);
            defaultFormProcessors.put(entityType, ((DefaultFormProcessor) formProcessor));
        }

        return formProcessor;
    }
}
