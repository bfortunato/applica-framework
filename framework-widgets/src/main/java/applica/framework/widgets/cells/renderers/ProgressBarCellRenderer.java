package applica.framework.widgets.cells.renderers;

import applica.framework.widgets.Grid;
import applica.framework.widgets.GridColumn;

public class ProgressBarCellRenderer extends BaseCellRenderer {

    @Override
    protected String createTemplatePath(Grid grid, GridColumn column) {
        return "/templates/cells/progress.vm";
    }

}
