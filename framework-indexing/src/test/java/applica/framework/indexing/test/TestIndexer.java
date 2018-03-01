package applica.framework.indexing.test;

import applica.framework.indexing.core.IndexedFieldMetadata;
import applica.framework.indexing.core.IndexedMetadata;
import applica.framework.indexing.core.IndexedObject;
import applica.framework.indexing.core.Indexer;

import java.util.Date;

public class TestIndexer implements Indexer<TestEntity>
{
    @Override
    public IndexedObject index(TestEntity indexable) {
        IndexedObject indexedObject = new IndexedObject();
        indexedObject.setUniqueId(indexable.getSid());
        indexedObject.setProperty("intValue", indexable.getIntValue());
        indexedObject.setProperty("floatValue", indexable.getFloatValue());
        indexedObject.setProperty("longValue", indexable.getLongValue());
        indexedObject.setProperty("doubleValue", indexable.getDoubleValue());
        indexedObject.setProperty("stringValue", indexable.getStringValue());
        indexedObject.setProperty("dateValue", indexable.getDateValue());

        return indexedObject;
    }

    @Override
    public IndexedMetadata metadata(Class<TestEntity> entityType) {
        return new IndexedMetadata()
                .setDefault(new IndexedFieldMetadata(null, String.class))
                .add(new IndexedFieldMetadata("intValue", Integer.class))
                .add(new IndexedFieldMetadata("floatValue", Float.class))
                .add(new IndexedFieldMetadata("longValue", Long.class))
                .add(new IndexedFieldMetadata("doubleValue", Double.class))
                .add(new IndexedFieldMetadata("dateValue", Date.class));
    }

    @Override
    public Class getEntityType() {
        return TestEntity.class;
    }
}
