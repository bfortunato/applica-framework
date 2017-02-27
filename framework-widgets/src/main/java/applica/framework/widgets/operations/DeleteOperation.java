package applica.framework.widgets.operations;

import applica.framework.Entity;

import java.util.List;

public interface DeleteOperation {

    void delete(String id) throws OperationException;
    void delete(List<String> ids) throws OperationException;
    Class<? extends Entity> getEntityType();

}
