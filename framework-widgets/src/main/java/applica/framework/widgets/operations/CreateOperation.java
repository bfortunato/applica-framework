package applica.framework.widgets.operations;

import applica.framework.Entity;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.Map;

public interface CreateOperation {
    ObjectNode create(Map<String, Object> params) throws OperationException;
    Class<? extends Entity> getEntityType();
}
