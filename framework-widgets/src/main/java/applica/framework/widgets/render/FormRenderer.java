package applica.framework.widgets.render;

import applica.framework.widgets.Form;

import java.io.Writer;
import java.util.Map;

/**
 * Represents base interface for form rendering
 */
public interface FormRenderer {
    /**
     * Render a form in specified writer
     * @param writer The writer that contains output
     * @param form Form object
     * @param data Form data.
     */
    void render(Writer writer, Form form, Map<String, Object> data);
}
