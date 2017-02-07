package applica.framework.widgets.operations;

import applica.framework.Entity;
import com.fasterxml.jackson.databind.node.ObjectNode;

public interface SaveOperation {

    Class<? extends Entity> getEntityType();
    void save(ObjectNode data) throws OperationException;

}
