package applica.framework.widgets.render;

import applica.framework.widgets.Grid;

import java.io.Writer;
import java.util.List;
import java.util.Map;

/**
 * Represents the base interface for grids rendering
 */
public interface GridRenderer {
    /**
     * Render a grid in specified writer
     * @param writer The writer that contains output
     * @param grid Grid object
     * @param rows Grid data
     */
    void render(Writer writer, Grid grid, List<Map<String, Object>> rows);
}

