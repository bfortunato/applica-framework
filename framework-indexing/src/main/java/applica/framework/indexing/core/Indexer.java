package applica.framework.indexing.core;

import applica.framework.Entity;

public interface Indexer<T extends Entity> {

    IndexedObject index(T indexable);
    IndexedMetadata<T> metadata(Class<T> entityType);
    Class<T> getEntityType();
}
