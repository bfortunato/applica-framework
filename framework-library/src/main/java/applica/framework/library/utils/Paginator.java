package applica.framework.library.utils;

import applica.framework.Entity;
import applica.framework.Query;

import java.util.ArrayList;
import java.util.List;

public class Paginator {

    private int pages;
    private int page;
    private int rowsPerPage;
    private List<? extends Entity> entities;
    private Query query;

    public Paginator(List<? extends Entity> entities, Query query) {
        super();
        this.entities = entities;
        this.query = query;
    }

    public int getPages() {
        return pages;
    }

    public void setPages(int pages) {
        this.pages = pages;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getRowsPerPage() {
        return rowsPerPage;
    }

    public void setRowsPerPage(int rowsPerPage) {
        this.rowsPerPage = rowsPerPage;
    }

    public List<? extends Entity> getEntities() {
        return entities;
    }

    public void setEntities(List<? extends Entity> entities) {
        this.entities = entities;
    }

    public Query getQuery() {
        return query;
    }

    public void setQuery(Query query) {
        this.query = query;
    }

    @SuppressWarnings({"rawtypes", "unchecked"})
    public void paginate() {
        pages = (int) Math.ceil((double) entities.size() / (double) query.getRowsPerPage());
        page = query.getPage();
        rowsPerPage = query.getRowsPerPage();

        List removableItems = new ArrayList();
        int row = 0;
        int start = (query.getPage() - 1) * query.getRowsPerPage();
        int stop = start + query.getRowsPerPage();
        for (Object o : entities) {
            if (!(row >= start && row < stop)) {
                removableItems.add(o);
            }

            row++;
        }

        for (Object o : removableItems) {
            entities.remove(o);
        }
    }

}
