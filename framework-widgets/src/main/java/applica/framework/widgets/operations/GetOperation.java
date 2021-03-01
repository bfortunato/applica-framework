package applica.framework.widgets.operations;

import applica.framework.Entity;
import com.fasterxml.jackson.databind.node.ObjectNode;

public interface GetOperation {

    ObjectNode get(Object id) throws OperationException;

    ObjectNode getFromEntity(Entity entity) throws OperationException;

    Entity fetch(Object id) throws OperationException;

    Class<? extends Entity> getEntityType();

}
