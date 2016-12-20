package applica.framework.widgets.builders;

import applica.framework.RepositoriesFactory;
import applica.framework.Entity;
import applica.framework.Repository;
import applica.framework.library.utils.ProgramException;
import applica.framework.widgets.factory.FormProcessorFactory;
import applica.framework.widgets.operations.SaveOperation;
import applica.framework.widgets.processors.FormProcessor;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

public class SaveOperationBuilder {

    @Autowired
    private FormProcessorFactory formProcessorFactory;

    @Autowired
    private RepositoriesFactory repositoriesFactory;

    private Log logger = LogFactory.getLog(getClass());

    public SaveOperation build(Class<? extends Entity> entityType) throws ProgramException {
        logger.info(String.format("Building save operation for : %s", entityType.getName()));

        Repository repository = repositoriesFactory.createForEntity(entityType);
        FormProcessor formProcessor = formProcessorFactory.create(entityType);

        SaveOperation operation = new SaveOperation();
        operation.setRepository(repository);
        operation.setFormProcessor(formProcessor);
        operation.setEntityType(entityType);

        return operation;
    }
}
