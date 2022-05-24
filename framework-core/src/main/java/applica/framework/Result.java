package applica.framework;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.stream.Collectors;

public class Result<T extends Entity> {

    private List<T> rows = new ArrayList<>();
    private long totalRows;
    private long page;
    private long rowsPerPage;

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
        return Optional.ofNullable((rows != null && rows.size() > 0) ? rows.get(0) : null);
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

    public <R extends Entity> Result<R> map(Function<T, R> mapper) {
        Result<R> mapped = new Result<>();
        mapped.setTotalRows(this.getTotalRows());
        mapped.setRows(this.getRows().stream().map(mapper).collect(Collectors.toList()));

        return mapped;
    }

    public long getPage() {
        return page;
    }

    public void setPage(long page) {
        this.page = page;
    }

    public long getRowsPerPage() {
        return rowsPerPage;
    }

    public void setRowsPerPage(long rowsPerPage) {
        this.rowsPerPage = rowsPerPage;
    }

    public boolean isHasMore() {
        if (rowsPerPage > 0) {
            double totalPages = Math.ceil((double) this.totalRows / (double) this.rowsPerPage);
            return page < totalPages;
        }

        return false;
    }
}
