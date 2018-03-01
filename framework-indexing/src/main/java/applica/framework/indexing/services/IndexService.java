package applica.framework.indexing.services;

import applica.framework.Entity;
import applica.framework.Query;
import applica.framework.indexing.core.IndexedObject;

import java.util.List;

public interface IndexService {

    <T extends Entity> void index(T entity);

    void remove(String uniqueId);

    <T extends Entity> List<IndexedObject> search(Class<T> entityType, Query query);

}
