package applica.framework.widgets.builders;

import applica.framework.Entity;
import applica.framework.widgets.CrudConfiguration;
import applica.framework.widgets.CrudConfigurationException;
import applica.framework.widgets.processors.FormProcessor;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 26/10/13
 * Time: 12:11
 */
public class FormProcessorBuilder {

    private Log logger = LogFactory.getLog(getClass());

    private FormProcessorBuilder() {};

    private static FormProcessorBuilder s_instance = null;

    public static FormProcessorBuilder instance() {
        if (s_instance == null)
            s_instance = new FormProcessorBuilder();

        return s_instance;
    }

    public FormProcessor build(String identifier) throws CrudConfigurationException {
        try {
            Class<? extends Entity> type = CrudConfiguration.instance().getFormTypeFromIdentifier(identifier);

            if (type == null) {
                throw new CrudConfigurationException("Form processor not registered for type: " + identifier);
            }

            FormProcessor formProcessor = CrudConfiguration.instance().getFormProcessor(type);

            return formProcessor;
        } catch (CrudConfigurationException ex) {
            logger.error("Configuration error: " + ex.getMessage());
            throw ex;
        }
    }

}
