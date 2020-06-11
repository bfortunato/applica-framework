package applica.framework.widgets.operations;

import applica.framework.*;
import com.fasterxml.jackson.databind.node.ObjectNode;

public interface FindOperation {

    void disableAutomaticMaterialization();
    void enableAutomaticMaterialization();
    ObjectNode find(Query query) throws OperationException;
    Class<? extends Entity> getEntityType();
    Result<? extends Entity> fetch(Query query);

}
