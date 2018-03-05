package applica.framework.indexing.core;

import applica.framework.Entity;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.function.Function;
import java.util.function.Supplier;

public class IndexedMetadata<T extends Entity> {

    private List<IndexedFieldMetadata> fields = new ArrayList<>();
    private Class<T> entityType;

    private Function<String, IndexedFieldMetadata> defaultFieldMetadataSupplier = fieldName -> new IndexedFieldMetadata(fieldName, String.class, true);

    public IndexedMetadata(Class<T> entityType) {
        this.entityType = entityType;
    }

    private IndexedFieldMetadata createDefault(String fieldName) {
        return defaultFieldMetadataSupplier.apply(fieldName);
    }

    public IndexedFieldMetadata get(String fieldName) {
        return fields
                .stream()
                .filter(f -> Objects.equals(fieldName, f.getFieldName()))
                .findFirst()
                .orElse(createDefault(fieldName));

    }

    public IndexedMetadata<T> add(IndexedFieldMetadata fieldMetaData) {
        fields.add(fieldMetaData);
        return this;
    }

    public IndexedMetadata<T> setDefaultFieldMetadataSupplier(Function<String, IndexedFieldMetadata> supplier) {
        this.defaultFieldMetadataSupplier = supplier;
        return this;
    }


    public List<IndexedFieldMetadata> getFields() {
        return fields;
    }

    public Class<T> getEntityType() {
        return entityType;
    }

    public void setEntityType(Class<T> entityType) {
        this.entityType = entityType;
    }
}
