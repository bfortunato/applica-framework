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

    public void load(Grid grid, LoadRequest loadRequest) throws CrudConfigurationException {
        if (repository == null) throw new CrudConfigurationException("Missing repository");

        loadRequest.setRowsPerPage(grid.getRowsPerPage());
        if (loadRequest.getSorts() == null) {
            Sort defaultSort = grid.getDefaultSort();
            if (defaultSort != null) {
                loadRequest.setSorts(Arrays.asList(defaultSort));
            }
        }

        grid.setSearched(loadRequest.getFilters().size() > 0);

        List<Map<String, Object>> data = new ArrayList<>();
        LoadResponse response = repository.find(loadRequest);
        List<? extends Entity> entities = response.getRows();
        GridDataMapper mapper = new SimpleGridDataMapper();
        mapper.mapGridDataFromEntities(grid.getDescriptor(), data, entities);

        grid.setData(data);
        grid.setCurrentPage(loadRequest.getPage());
        grid.setPages((int) Math.ceil((double) response.getTotalRows() / grid.getRowsPerPage()));

        //grid now supports only 1 sort
        if (loadRequest.getSorts() != null && loadRequest.getSorts().size() > 0) {
            grid.setSortBy(loadRequest.getSorts().get(0));
        }

        if (grid.getSearchForm() != null) {
            grid.getSearchForm().setData(loadRequest.filtersMap());
        }
    }
}
