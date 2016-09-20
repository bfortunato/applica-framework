package applica.framework.widgets.builders;

import applica.framework.widgets.CrudConfiguration;
import applica.framework.widgets.CrudConfigurationException;
import applica.framework.Entity;
import applica.framework.Repository;
import applica.framework.widgets.operations.SaveOperation;
import applica.framework.widgets.processors.FormProcessor;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class SaveOperationBuilder {

    private static SaveOperationBuilder s_instance;

    public static SaveOperationBuilder instance() {
        if (s_instance == null) s_instance = new SaveOperationBuilder();
        return s_instance;
    }

    private SaveOperationBuilder() {
    }

    private Log logger = LogFactory.getLog(getClass());

    public SaveOperation build(String identifier) throws CrudConfigurationException {
        logger.info(String.format("Building save operation for identifier: %s", identifier));

        Class<? extends Entity> type = CrudConfiguration.instance().getFormTypeFromIdentifier(identifier);

        Repository repository = CrudConfiguration.instance().getFormRepository(type);
        if (repository == null) throw new CrudConfigurationException("Cannot create repository");

        FormProcessor formProcessor = CrudConfiguration.instance().getFormProcessor(type);
        if (formProcessor == null) throw new CrudConfigurationException("Cannot create form processor");

        SaveOperation operation = new SaveOperation();
        operation.setRepository(repository);
        operation.setFormProcessor(formProcessor);
        operation.setType(type);

        return operation;
    }
}
