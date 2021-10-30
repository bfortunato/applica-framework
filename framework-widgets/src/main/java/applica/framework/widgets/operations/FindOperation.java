package applica.framework.widgets.operations;

import applica.framework.Entity;
import applica.framework.Query;
import applica.framework.Result;
import com.fasterxml.jackson.databind.node.ObjectNode;

public interface FindOperation {

    void disableAutomaticMaterialization();
    void enableAutomaticMaterialization();
    ObjectNode find(Query query) throws OperationException;
    Class<? extends Entity> getEntityType();

    ObjectNode serialize(Result<? extends Entity> result) throws OperationException;

    Result<? extends Entity> fetch(Query query) throws OperationException;



}
