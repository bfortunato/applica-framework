package applica.framework.indexing.test;

import applica.framework.indexing.core.IndexedFieldMetadata;
import applica.framework.indexing.core.IndexedMetadata;
import applica.framework.indexing.core.IndexedObject;
import applica.framework.indexing.core.Indexer;
import org.junit.Test;

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
        indexedObject.setProperty("booleanValue", indexable.isBooleanValue());
        indexedObject.setProperty("textValue", indexable.getTextValue());


        return indexedObject;
    }

    @Override
    public IndexedMetadata<TestEntity> metadata(Class<TestEntity> entityType) {
        return new IndexedMetadata<>(TestEntity.class)
                .setDefaultFieldMetadataSupplier(fieldName -> new IndexedFieldMetadata(fieldName, String.class, false))
                .add(new IndexedFieldMetadata("intValue", Integer.class, true))
                .add(new IndexedFieldMetadata("floatValue", Float.class, false))
                .add(new IndexedFieldMetadata("longValue", Long.class, false))
                .add(new IndexedFieldMetadata("doubleValue", Double.class, false))
                .add(new IndexedFieldMetadata("dateValue", Date.class, false))
                .add(new IndexedFieldMetadata("booleanValue", Boolean.class, false))
                .add(IndexedFieldMetadata.textField("textValue"));
    }


    @Override
    public Class<TestEntity> getEntityType() {
        return TestEntity.class;
    }
}
