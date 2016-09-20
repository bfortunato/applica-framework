package applica._APPNAME_.admin.fields.renderers;

import applica.framework.widgets.FormField;
import applica.framework.widgets.render.FormFieldRenderer;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.Writer;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 20/02/14
 * Time: 13:14
 */
@Component
public class ParamsPrinterRenderer implements FormFieldRenderer {


    @Override
    public void render(Writer writer, FormField field, Object value) {
        for(String key : field.getParams().keySet()) {
            try {
                writer.write(String.format("<b>%s</b>%s = %s<br>", field.getProperty(), key, field.getParams().get(key)));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
