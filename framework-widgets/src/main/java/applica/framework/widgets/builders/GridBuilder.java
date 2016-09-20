package applica.framework.widgets.builders;

import applica.framework.Entity;
import applica.framework.widgets.*;
import applica.framework.widgets.acl.Visibility;
import applica.framework.widgets.render.GridRenderer;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.util.StringUtils;

public class GridBuilder {

    private Log logger = LogFactory.getLog(getClass());

    private GridBuilder() {
    }

    ;

    private static GridBuilder s_instance = null;

    public static GridBuilder instance() {
        if (s_instance == null)
            s_instance = new GridBuilder();

        return s_instance;
    }

    public Grid build(String identifier) throws GridCreationException, CrudConfigurationException {
        logger.info("Creating Grid " + identifier);

        try {
            Class<? extends Entity> type = CrudConfiguration.instance().getGridTypeFromIdentifier(identifier);

            if (type == null) {
                throw new CrudConfigurationException("Grid not registered for type: " + identifier);
            }

            Grid grid = new Grid();
            grid.setIdentifier(identifier);

            String pRowsPerPage = CrudConfiguration.instance().getDefaultParam(type, Grid.PARAM_ROWS_PER_PAGE);
            if (StringUtils.hasLength(pRowsPerPage)) {
                grid.setRowsPerPage(Integer.parseInt(pRowsPerPage));
            }

            String pSortable = CrudConfiguration.instance().getDefaultParam(type, Grid.PARAM_SORTABLE);
            if (StringUtils.hasLength(pSortable)) {
                grid.setSortable(Boolean.parseBoolean(pSortable));
            }

            grid.setFormIdentifier(CrudConfiguration.instance().getGridFormIdentifier(identifier));

            GridRenderer renderer = CrudConfiguration.instance().getGridRenderer(type);
            if (renderer == null) throw new GridCreationException("Cannot create renderer");

            GridDescriptor descriptor = CrudConfiguration.instance().getGridDescriptor(type);
            if (descriptor == null) throw new GridCreationException("Cannot create descriptor");

            Visibility visibility = CrudConfiguration.instance().getVisibility(type);

            grid.setRenderer(renderer);
            grid.setDescriptor(descriptor);
            grid.setDefaultSort(CrudConfiguration.instance().getSortBy(type));
            grid.setTitle(CrudConfiguration.instance().getGridTitle(type));
            grid.setParams(CrudConfiguration.instance().getParams(type));
            grid.setVisibility(visibility);

            logger.info(String.format("%s renderer class: %s", identifier, renderer.getClass().getName()));

            Class<? extends Entity> searchableType = CrudConfiguration.instance().getSearchable(type);
            if (searchableType != null) {
                logger.info(String.format("%s has searchable: %s", identifier, searchableType.getName()));

                try {
                    Form searchableForm = FormBuilder.instance().build(CrudConfiguration.instance().getFormIdentifierFromType(searchableType));
                    grid.setSearchForm(searchableForm);
                } catch (FormCreationException e) {
                    logger.error("Error creating searchable form " + searchableType.getName());
                    e.printStackTrace();
                }
            }

            for (GridColumn column : descriptor.getColumns()) {
                column.setRenderer(CrudConfiguration.instance().getCellRenderer(type, column.getProperty()));
                column.setParams(CrudConfiguration.instance().getPropertyParams(type, column.getProperty()));
            }

            return grid;
        } catch (CrudConfigurationException ex) {
            logger.error("Configuration error: " + ex.getMessage());
            throw ex;
        } catch (GridCreationException ex) {
            logger.error("Error creating grid: " + ex.getMessage());
            throw ex;
        }
    }
}
