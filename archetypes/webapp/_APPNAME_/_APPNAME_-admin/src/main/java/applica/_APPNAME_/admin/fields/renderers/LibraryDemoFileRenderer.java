package applica._APPNAME_.admin.fields.renderers;

import applica.framework.widgets.fields.renderers.FileFieldRenderer;
import org.springframework.stereotype.Component;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 3/4/13
 * Time: 11:33 AM
 */
@Component
public class LibraryDemoFileRenderer extends FileFieldRenderer {

    @Override
    public String getPath() {
        return "demo/";
    }

}
