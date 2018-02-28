package applica.framework.indexing.core;

import applica.framework.Entity;
import applica.framework.library.dynaobject.DynamicObject;
import org.apache.lucene.document.Document;

public interface Indexer<T extends Entity> {

    IndexedObject index(T indexable);
    Class<T> getEntityType();
}
