package applica.framework.widgets.render;

import applica.framework.widgets.FormField;

import java.io.Writer;

/**
 * Represents base interface for form field rendering
 */
public interface FormFieldRenderer {
    /**
     * Render a field in specified writer
     * @param writer The writer that contains output
     * @param field Field object
     * @param value Field value
     */
    void render(Writer writer, FormField field, Object value);
}
