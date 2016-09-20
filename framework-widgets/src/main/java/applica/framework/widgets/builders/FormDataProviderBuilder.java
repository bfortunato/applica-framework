package applica.framework.widgets.builders;

import applica.framework.widgets.CrudConfiguration;
import applica.framework.widgets.CrudConfigurationException;
import applica.framework.Entity;
import applica.framework.widgets.data.FormDataProvider;
import applica.framework.Repository;
import applica.framework.widgets.processors.FormProcessor;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class FormDataProviderBuilder {

    private Log logger = LogFactory.getLog(getClass());

    private FormDataProviderBuilder() {
    }

    ;

    private static FormDataProviderBuilder s_instance = null;

    public static FormDataProviderBuilder instance() {
        if (s_instance == null)
            s_instance = new FormDataProviderBuilder();

        return s_instance;
    }

    public FormDataProvider build(String identifier) throws CrudConfigurationException {
        logger.info("Creating Form data provider " + identifier);

        try {
            Class<? extends Entity> type = CrudConfiguration.instance().getFormTypeFromIdentifier(identifier);

            if (type == null) {
                throw new CrudConfigurationException("Form not registered for type: " + identifier);
            }

            FormDataProvider formDataProvider = new FormDataProvider();

            Repository repository = CrudConfiguration.instance().getFormRepository(type);
            if (repository == null) throw new CrudConfigurationException("Cannot create repository");

            FormProcessor formProcessor = CrudConfiguration.instance().getFormProcessor(type);
            if (formProcessor == null) throw new CrudConfigurationException("Cannot create processor");

            formDataProvider.setFormProcessor(formProcessor);
            formDataProvider.setRepository(repository);

            return formDataProvider;
        } catch (CrudConfigurationException ex) {
            logger.error("Configuration error: " + ex.getMessage());
            throw ex;
        }
    }
}
