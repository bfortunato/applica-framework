package applica.framework;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class LoadResponse<T extends Entity> {

    private List<T> rows = new ArrayList<>();
    private long totalRows;

    @SuppressWarnings("unchecked")
    @Deprecated
    public <T extends Entity> List<T> getRows(Class<T> type) {
        return (List<T>) rows;
    }

    public List<T> getRows() {
        return rows;
    }

    @SuppressWarnings("unchecked")
    @Deprecated
    /**
     * Gets first record found in search query
     * Deprecated: use findFirst
     */
    public <T extends Entity> T getOne(Class<T> type) {
        if (rows != null && rows.size() > 0) return (T) rows.get(0);
        return null;
    }

    public Optional<T> findFirst() {
        return Optional.ofNullable((rows != null && rows.size() > 0) ? (T) rows.get(0) : null);
    }

    public void setRows(List<T> rows) {
        this.rows = rows;
    }

    public long getTotalRows() {
        return totalRows;
    }

    public void setTotalRows(long totalRows) {
        this.totalRows = totalRows;
    }

}
