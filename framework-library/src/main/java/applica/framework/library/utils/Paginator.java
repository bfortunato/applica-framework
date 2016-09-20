package applica.framework.library.utils;

import applica.framework.Entity;
import applica.framework.LoadRequest;

import java.util.ArrayList;
import java.util.List;

public class Paginator {

    private int pages;
    private int page;
    private int rowsPerPage;
    private List<? extends Entity> entities;
    private LoadRequest loadRequest;

    public Paginator(List<? extends Entity> entities, LoadRequest loadRequest) {
        super();
        this.entities = entities;
        this.loadRequest = loadRequest;
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

    public LoadRequest getLoadRequest() {
        return loadRequest;
    }

    public void setLoadRequest(LoadRequest loadRequest) {
        this.loadRequest = loadRequest;
    }

    @SuppressWarnings({"rawtypes", "unchecked"})
    public void paginate() {
        pages = (int) Math.ceil((double) entities.size() / (double) loadRequest.getRowsPerPage());
        page = loadRequest.getPage();
        rowsPerPage = loadRequest.getRowsPerPage();

        List removableItems = new ArrayList();
        int row = 0;
        int start = (loadRequest.getPage() - 1) * loadRequest.getRowsPerPage();
        int stop = start + loadRequest.getRowsPerPage();
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
