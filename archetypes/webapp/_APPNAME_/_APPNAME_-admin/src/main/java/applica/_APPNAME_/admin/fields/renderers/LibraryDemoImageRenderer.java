package applica._APPNAME_.admin.fields.renderers;

import applica.framework.widgets.fields.renderers.FileFieldRenderer;
import applica.framework.widgets.fields.renderers.ImagesFieldRenderer;
import org.springframework.stereotype.Component;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 3/4/13
 * Time: 11:33 AM
 */
@Component
public class LibraryDemoImageRenderer extends ImagesFieldRenderer {

    @Override
    public String getPath() {
        return "demo/";
    }

}
