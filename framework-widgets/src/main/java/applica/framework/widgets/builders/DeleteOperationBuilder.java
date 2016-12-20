package applica.framework.widgets.builders;

import applica.framework.Entity;
import applica.framework.RepositoriesFactory;
import applica.framework.Repository;
import applica.framework.widgets.operations.DeleteOperation;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

public class DeleteOperationBuilder {

    private Log logger = LogFactory.getLog(getClass());

    @Autowired
    private RepositoriesFactory repositoriesFactory;

    public DeleteOperation build(Class<? extends Entity> entityType) {
        logger.info(String.format("Building delete operation for class: %s", entityType.getName()));

        Repository repository = repositoriesFactory.createForEntity(entityType);

        DeleteOperation operation = new DeleteOperation();
        operation.setRepository(repository);

        return operation;
    }
}
