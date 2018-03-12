package applica.framework.indexing.core;

import applica.framework.Entity;

import java.util.ArrayList;
import java.util.Date;
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

    public IndexedMetadata addDoubleField(String fieldName) {
        fields.add(new IndexedFieldMetadata(fieldName, Double.class, false));
        return this;
    }

    public IndexedMetadata addSortableDoubleField(String fieldName) {
        fields.add(new IndexedFieldMetadata(fieldName, Double.class, true));
        return this;
    }

    public IndexedMetadata addFloatField(String fieldName) {
        fields.add(new IndexedFieldMetadata(fieldName, Float.class, false));
        return this;
    }

    public IndexedMetadata addSortableFloatField(String fieldName) {
        fields.add(new IndexedFieldMetadata(fieldName, Float.class, true));
        return this;
    }

    public IndexedMetadata addLongField(String fieldName) {
        fields.add(new IndexedFieldMetadata(fieldName, Long.class, false));
        return this;
    }

    public IndexedMetadata addSortableLongField(String fieldName) {
        fields.add(new IndexedFieldMetadata(fieldName, Long.class, true));
        return this;
    }

    public IndexedMetadata addIntField(String fieldName) {
        fields.add(new IndexedFieldMetadata(fieldName, Integer.class, false));
        return this;
    }

    public IndexedMetadata addSortableIntField(String fieldName) {
        fields.add(new IndexedFieldMetadata(fieldName, Integer.class, true));
        return this;
    }

    public IndexedMetadata addBooleanField(String fieldName) {
        fields.add(new IndexedFieldMetadata(fieldName, Boolean.class, false));
        return this;
    }

    public IndexedMetadata addSortableBooleanField(String fieldName) {
        fields.add(new IndexedFieldMetadata(fieldName, Boolean.class, true));
        return this;
    }

    public IndexedMetadata addDateField(String fieldName) {
        fields.add(new IndexedFieldMetadata(fieldName, Date.class, false));
        return this;
    }

    public IndexedMetadata addSortableDateField(String fieldName) {
        fields.add(new IndexedFieldMetadata(fieldName, Date.class, true));
        return this;
    }

    public IndexedMetadata addStringField(String fieldName) {
        fields.add(new IndexedFieldMetadata(fieldName, String.class, false));
        return this;
    }

    public IndexedMetadata addSortableStringField(String fieldName) {
        fields.add(new IndexedFieldMetadata(fieldName, String.class, true));
        return this;
    }

    public IndexedMetadata addTextField(String fieldName) {
        fields.add(new IndexedFieldMetadata(fieldName, true, false));
        return this;
    }
}
