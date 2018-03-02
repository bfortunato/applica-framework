package applica.framework.indexing.core;

import applica.framework.Entity;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class IndexedMetadata<T extends Entity> {

    private List<IndexedFieldMetadata> fields = new ArrayList<>();
    private IndexedFieldMetadata default_;
    private Class<T> entityType;

    public IndexedMetadata(Class<T> entityType) {
        this.entityType = entityType;
    }

    public IndexedFieldMetadata get(String fieldName) {
        return fields
                .stream()
                .filter(f -> Objects.equals(fieldName, f.getFieldName()))
                .findFirst()
                .orElse(default_);

    }

    public IndexedMetadata<T> add(IndexedFieldMetadata fieldMetaData) {
        fields.add(fieldMetaData);
        return this;
    }

    public IndexedMetadata<T> setDefault(IndexedFieldMetadata indexedFieldMetadata) {
        this.default_ = indexedFieldMetadata;
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
