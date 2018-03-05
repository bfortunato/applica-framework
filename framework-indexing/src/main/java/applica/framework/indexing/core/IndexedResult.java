package applica.framework.indexing.core;

import java.util.List;

public class IndexedResult {

    private final List<IndexedObject> rows;
    private final int totalRows;

    public IndexedResult(List<IndexedObject> rows, int totalRows) {
        this.rows = rows;
        this.totalRows = totalRows;
    }

    public List<IndexedObject> getRows() {
        return rows;
    }

    public int getTotalRows() {
        return totalRows;
    }
}
