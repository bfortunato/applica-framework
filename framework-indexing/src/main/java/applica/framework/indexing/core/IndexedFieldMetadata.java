package applica.framework.indexing.core;

public class IndexedFieldMetadata {

    private final boolean sortable;
    private String fieldName;
    private Class fieldType;

    public IndexedFieldMetadata(String fieldName, Class fieldType, boolean sortable) {
        this.fieldName = fieldName;
        this.fieldType = fieldType;
        this.sortable = sortable;
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
}
