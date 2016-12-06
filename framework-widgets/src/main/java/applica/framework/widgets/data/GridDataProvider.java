package applica.framework.widgets.data;

import applica.framework.*;
import applica.framework.widgets.CrudConfigurationException;
import applica.framework.widgets.Grid;
import applica.framework.widgets.mapping.GridDataMapper;
import applica.framework.widgets.mapping.SimpleGridDataMapper;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

public class GridDataProvider {

    private Repository repository;

    public Repository getRepository() {
        return repository;
    }

    public void setRepository(Repository repository) {
        this.repository = repository;
    }

    public void load(Grid grid, Query query) throws CrudConfigurationException {
        if (repository == null) throw new CrudConfigurationException("Missing repository");

        query.setRowsPerPage(grid.getRowsPerPage());
        if (query.getSorts() == null) {
            Sort defaultSort = grid.getDefaultSort();
            if (defaultSort != null) {
                query.setSorts(Arrays.asList(defaultSort));
            }
        }

        grid.setSearched(query.getFilters().size() > 0);

        List<Map<String, Object>> data = new ArrayList<>();
        Result response = repository.find(query);
        List<? extends Entity> entities = response.getRows();
        GridDataMapper mapper = new SimpleGridDataMapper();
        mapper.mapGridDataFromEntities(grid.getDescriptor(), data, entities);

        grid.setData(data);
        grid.setCurrentPage(query.getPage());
        grid.setPages((int) Math.ceil((double) response.getTotalRows() / grid.getRowsPerPage()));

        //grid now supports only 1 sort
        if (query.getSorts() != null && query.getSorts().size() > 0) {
            grid.setSortBy(query.getSorts().get(0));
        }

        if (grid.getSearchForm() != null) {
            grid.getSearchForm().setData(query.filtersMap());
        }
    }
}
