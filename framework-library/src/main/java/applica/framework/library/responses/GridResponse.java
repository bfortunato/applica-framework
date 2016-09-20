package applica.framework.library.responses;

public class GridResponse extends ContentResponse {
    private int totalRows;
    private long pages;
    private int currentPage;
    private String formIdentifier;
    private boolean searchFormIncluded;
    private String title;

    public int getTotalRows() {
        return totalRows;
    }

    public void setTotalRows(int totalRows) {
        this.totalRows = totalRows;
    }

    public long getPages() {
        return pages;
    }

    public void setPages(long pages) {
        this.pages = pages;
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }

    public String getFormIdentifier() {
        return formIdentifier;
    }

    public void setFormIdentifier(String formIdentifier) {
        this.formIdentifier = formIdentifier;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public boolean isSearchFormIncluded() {
        return searchFormIncluded;
    }

    public void setSearchFormIncluded(boolean searchFormIncluded) {
        this.searchFormIncluded = searchFormIncluded;
    }
}
