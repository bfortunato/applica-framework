package applica.framework.widgets;

import applica.framework.library.utils.ParametrizedObject;
import applica.framework.widgets.render.CellRenderer;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.StringWriter;
import java.io.Writer;
import java.lang.reflect.Type;

/**
 * Represents a grid column and contains all informations about that.
 * Also has the capacity to render a cell
 */
public class GridColumn extends ParametrizedObject {

    private CellRenderer renderer;
    private String header;
    private String property;
    private boolean linked;
    private Grid grid;
    private Type dataType;

    private Log logger = LogFactory.getLog(getClass());

    public GridColumn(Grid grid, String property, String header, Type dataType, boolean linked, CellRenderer renderer) {
        super();
        this.grid = grid;
        this.property = property;
        this.header = header;
        this.dataType = dataType;
        this.linked = linked;
        this.renderer = renderer;
    }

    public Grid getGrid() {
        return grid;
    }

    public void setGrid(Grid grid) {
        this.grid = grid;
    }

    public CellRenderer getRenderer() {
        return renderer;
    }

    public void setRenderer(CellRenderer renderer) {
        this.renderer = renderer;
    }

    public String getHeader() {
        return header;
    }

    public void setHeader(String header) {
        this.header = header;
    }

    public String getProperty() {
        return property;
    }

    public void setProperty(String property) {
        this.property = property;
    }

    public boolean isLinked() {
        return linked;
    }

    public void setLinked(boolean linked) {
        this.linked = linked;
    }

    public String writeToString(Object value) {
        StringWriter writer = new StringWriter();
        write(writer, value);

        return writer.toString();
    }

    public void write(Writer writer, Object value) {
        try {
            if (renderer == null) {
                writer.write("ERROR");
                logger.warn("Renderer not found for " + property);
                return;
            }

            renderer.render(writer, this, value);
        } catch (Exception ex) {
            ex.printStackTrace();
            logger.error("Error rendering field " + property + ": " + ex.getMessage());
        }
    }

    public Type getDataType() {
        return dataType;
    }

    public void setDataType(Type dataType) {
        this.dataType = dataType;
    }
}
