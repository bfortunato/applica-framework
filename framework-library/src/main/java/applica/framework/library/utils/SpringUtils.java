package applica.framework.library.utils;

import applica.framework.library.i18n.editors.LocalizedDatePropertyEditor;
import org.springframework.web.bind.WebDataBinder;

import java.util.Date;

public class SpringUtils {
    public static void registerDateModelBinder(WebDataBinder binder) {
        binder.registerCustomEditor(Date.class, new LocalizedDatePropertyEditor());
    }
}
