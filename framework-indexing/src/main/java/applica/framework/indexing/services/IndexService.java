package applica.framework.indexing.services;

import applica.framework.Entity;
import applica.framework.Query;
import applica.framework.indexing.core.IndexedObject;

import java.util.List;

public interface IndexService {

    void index(Entity entity);

    void remove(String uniqueId);

    <T extends Entity> List<IndexedObject> search(Class<T> entityType, Query query);

}
