package applica.framework.widgets.builders;

import applica.framework.Entity;
import applica.framework.RepositoriesFactory;
import applica.framework.Repository;
import applica.framework.library.utils.ProgramException;
import applica.framework.widgets.factory.FormProcessorFactory;
import applica.framework.widgets.operations.GetOperation;
import applica.framework.widgets.processors.FormProcessor;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

public class GetOperationBuilder {

    @Autowired
    private FormProcessorFactory formProcessorFactory;

    @Autowired
    private RepositoriesFactory repositoriesFactory;

    private Log logger = LogFactory.getLog(getClass());

    public GetOperation build(Class<? extends Entity> entityType) throws ProgramException {
        logger.info(String.format("Building get operation for : %s", entityType.getName()));

        Repository repository = repositoriesFactory.createForEntity(entityType);
        FormProcessor formProcessor = formProcessorFactory.create(entityType);

        GetOperation operation = new GetOperation();
        operation.setRepository(repository);
        operation.setFormProcessor(formProcessor);
        operation.setEntityType(entityType);

        return operation;
    }
}
