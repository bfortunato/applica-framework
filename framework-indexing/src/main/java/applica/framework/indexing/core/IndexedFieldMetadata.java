package applica.framework.indexing.core;

import java.util.Date;

public class IndexedFieldMetadata {

    private boolean sortable;
    private String fieldName;
    private Class fieldType;
    private boolean text;

    public IndexedFieldMetadata(String fieldName, Class fieldType, boolean sortable) {
        this.fieldName = fieldName;
        this.fieldType = fieldType;
        this.sortable = sortable;
    }

    public IndexedFieldMetadata(String fieldName, boolean text, boolean sortable) {
        this.fieldName = fieldName;
        this.text = text;
        this.sortable = sortable;
        this.fieldType = String.class;
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public Class getFieldType() {
        return fieldType;
    }

    public void setFieldType(Class fieldType) {
        this.fieldType = fieldType;
    }

    public boolean isSortable() {
        return sortable;
    }

    public boolean isText() {
        return text;
    }

    public void setText(boolean text) {
        this.text = text;
    }

    public static IndexedFieldMetadata doubleField(String fieldName) {
        return new IndexedFieldMetadata(fieldName, Double.class, false);
    }

    public static IndexedFieldMetadata sortableDoubleField(String fieldName) {
        return new IndexedFieldMetadata(fieldName, Double.class, true);
    }

    public static IndexedFieldMetadata floatField(String fieldName) {
        return new IndexedFieldMetadata(fieldName, Float.class, false);
    }

    public static IndexedFieldMetadata sortableFloatField(String fieldName) {
        return new IndexedFieldMetadata(fieldName, Float.class, true);
    }

    public static IndexedFieldMetadata longField(String fieldName) {
        return new IndexedFieldMetadata(fieldName, Long.class, false);
    }

    public static IndexedFieldMetadata sortableLongField(String fieldName) {
        return new IndexedFieldMetadata(fieldName, Long.class, true);
    }
    
    public static IndexedFieldMetadata intField(String fieldName) {
        return new IndexedFieldMetadata(fieldName, Integer.class, false);
    }

    public static IndexedFieldMetadata sortableIntField(String fieldName) {
        return new IndexedFieldMetadata(fieldName, Integer.class, true);
    }

    public static IndexedFieldMetadata booleanField(String fieldName) {
        return new IndexedFieldMetadata(fieldName, Boolean.class, false);
    }

    public static IndexedFieldMetadata sortableBooleanField(String fieldName) {
        return new IndexedFieldMetadata(fieldName, Boolean.class, true);
    }

    public static IndexedFieldMetadata dateField(String fieldName) {
        return new IndexedFieldMetadata(fieldName, Date.class, false);
    }

    public static IndexedFieldMetadata sortableDateField(String fieldName) {
        return new IndexedFieldMetadata(fieldName, Date.class, true);
    }

    public static IndexedFieldMetadata stringField(String fieldName) {
        return new IndexedFieldMetadata(fieldName, String.class, false);
    }

    public static IndexedFieldMetadata sortableStringField(String fieldName) {
        return new IndexedFieldMetadata(fieldName, String.class, true);
    }

    public static IndexedFieldMetadata textField(String fieldName) {
        return new IndexedFieldMetadata(fieldName, true, false);
    }
}
