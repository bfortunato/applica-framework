package applica.framework.indexing.services;

import applica.framework.Entity;
import applica.framework.Query;
import applica.framework.indexing.core.IndexedResult;

public interface IndexService {

    <T extends Entity> void index(T entity);
    void reindexAll(Class<? extends Entity> entityType, Query dataQuery);

    void remove(String uniqueId);

    <T extends Entity> IndexedResult search(Class<T> entityType, Query query);

    void setMaxHits(int maxHits);


}
