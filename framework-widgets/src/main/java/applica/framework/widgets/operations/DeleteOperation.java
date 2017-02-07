package applica.framework.widgets.operations;

import applica.framework.Entity;

import java.util.List;

public interface DeleteOperation {

    void delete(String id);
    void delete(List<String> ids);
    Class<? extends Entity> getEntityType();

}
