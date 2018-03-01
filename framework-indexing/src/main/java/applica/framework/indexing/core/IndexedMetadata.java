package applica.framework.indexing.core;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class IndexedMetadata {

    private List<IndexedFieldMetadata> fields = new ArrayList<>();
    private IndexedFieldMetadata default_;

    public IndexedFieldMetadata get(String fieldName) {
        return fields
                .stream()
                .filter(f -> Objects.equals(fieldName, f.getFieldName()))
                .findFirst()
                .orElse(default_);

    }

    public IndexedMetadata add(IndexedFieldMetadata fieldMetaData) {
        fields.add(fieldMetaData);
        return this;
    }

    public IndexedMetadata setDefault(IndexedFieldMetadata indexedFieldMetadata) {
        this.default_ = indexedFieldMetadata;
        return this;
    }


    public List<IndexedFieldMetadata> getFields() {
        return fields;
    }
}
