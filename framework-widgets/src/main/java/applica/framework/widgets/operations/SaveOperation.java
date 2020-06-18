package applica.framework.widgets.operations;

import applica.framework.Entity;
import applica.framework.library.validation.ValidationException;
import com.fasterxml.jackson.databind.node.ObjectNode;

public interface SaveOperation {

    Class<? extends Entity> getEntityType();
    Entity save(ObjectNode data) throws OperationException, ValidationException;

    void persist(Entity entity) throws OperationException;
}
