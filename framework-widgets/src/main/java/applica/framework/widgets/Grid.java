package applica.framework.widgets;

import applica.framework.Sort;
import applica.framework.library.utils.ParametrizedObject;
import applica.framework.widgets.acl.Visibility;
import applica.framework.widgets.render.GridRenderer;
import org.springframework.util.StringUtils;

import java.io.StringWriter;
import java.io.Writer;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Represents grids base class and contains all informations about a grid:
 * how to render, which columns have, which data to display, how to display that data, and so on.
 */
public class Grid extends ParametrizedObject {

    public static final String PARAM_ROWS_PER_PAGE = "grid_rows_per_page";
    public static final String PARAM_SORTABLE = "grid_sortable";

    private String identifier;
    private String formIdentifier;
    private GridDescriptor descriptor;
    private GridRenderer renderer;
    private Form searchForm;
    private int rowsPerPage = 50;
    private long pages;
    private int currentPage;
    private boolean searched;
    private boolean sortable = true;
    private List<Map<String, Object>> data = new ArrayList<>();
    private Sort defaultSort;
    private Sort sortBy;
    private String title;
    private Visibility visibility;

    public List<Map<String, Object>> getData() {
        return data;
    }

    public void setData(List<Map<String, Object>> data) {
        this.data = data;
    }

    public GridDescriptor getDescriptor() {
        return descriptor;
    }

    public void setDescriptor(GridDescriptor descriptor) {
        this.descriptor = descriptor;

        //adjust references
        if (descriptor != null) {
            descriptor.setGrid(this);
        }
    }

    public Sort getDefaultSort() {
        return defaultSort;
    }

    public void setDefaultSort(Sort defaultSort) {
        this.defaultSort = defaultSort;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public GridRenderer getRenderer() {
        return renderer;
    }

    public void setRenderer(GridRenderer renderer) {
        this.renderer = renderer;
    }

    public String getFormIdentifier() {
        if (StringUtils.hasLength(formIdentifier)) return formIdentifier;
        return identifier;
    }

    public void setFormIdentifier(String formIdentifier) {
        this.formIdentifier = formIdentifier;
    }

    public Form getSearchForm() {
        return searchForm;
    }

    public void setSearchForm(Form searchForm) {
        this.searchForm = searchForm;
    }

    public int getRowsPerPage() {
        return rowsPerPage;
    }

    public void setRowsPerPage(int rowsPerPage) {
        this.rowsPerPage = rowsPerPage;
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

    public boolean isSearched() {
        return searched;
    }

    public void setSearched(boolean searched) {
        this.searched = searched;
    }

    public boolean isSortable() {
        return sortable;
    }

    public void setSortable(boolean sortable) {
        this.sortable = sortable;
    }

    public Sort getSortBy() {
        return sortBy;
    }

    public void setSortBy(Sort sortBy) {
        this.sortBy = sortBy;
    }

    public String writeToString() throws GridCreationException {
        StringWriter writer = new StringWriter();
        write(writer);

        return writer.toString();
    }

    public void write(Writer writer) throws GridCreationException {
        if (renderer == null) throw new GridCreationException("Missing renderer");

        try {
            renderer.render(writer, this, data);
        } catch (Exception ex) {
            ex.printStackTrace();
            throw new GridCreationException("Error rendering grid " + ex.getMessage());
        }
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTitle() {
        return title;
    }

    public Visibility getVisibility() {
        return visibility;
    }

    public void setVisibility(Visibility visibility) {
        this.visibility = visibility;
    }

    public boolean isCellVisible(String property) {
        if (visibility == null) { return true; }
        else return (visibility.isColumnVisible(this, property));
    }
}
