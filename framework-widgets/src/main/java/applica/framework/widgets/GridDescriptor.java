package applica.framework.widgets;

import applica.framework.widgets.render.CellRenderer;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class GridDescriptor {
    private Grid grid;
    private List<GridColumn> columns = new ArrayList<GridColumn>();

    public GridDescriptor(Grid grid) {
        super();
        this.grid = grid;

        if(grid != null) {
            grid.setDescriptor(this);
        }
    }

    public Grid getGrid() {
        return grid;
    }

    public void setGrid(Grid grid) {
        this.grid = grid;

        for (GridColumn column : getColumns()) {
            column.setGrid(grid);
        }
    }

    public List<GridColumn> getColumns() {
        return columns;
    }

    public void setColumns(List<GridColumn> columns) {
        this.columns = columns;
    }

    public GridColumn addColumn(String property, String header, Type dataType, boolean linked, CellRenderer renderer) {
        GridColumn column = new GridColumn(grid, property, header, dataType, linked, renderer);
        columns.add(column);

        return column;
    }

    public List<GridColumn> getVisibleColumns() {
        return columns.stream().filter(f -> grid.isCellVisible(f.getProperty())).collect(Collectors.toList());
    }
}
