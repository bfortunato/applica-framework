package applica.framework.widgets.fields.renderers;

import applica.framework.library.SimpleItem;
import applica.framework.library.i18n.Localization;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.velocity.VelocityContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.WebApplicationContext;

import java.util.List;

public abstract class OptionalSelectFieldRenderer extends SelectFieldRenderer {
    private Log logger = LogFactory.getLog(getClass());

    @Autowired
    protected WebApplicationContext webApplicationContext;

    public abstract List<SimpleItem> getItems();

    @Override
    protected void setupContext(VelocityContext context) {
        super.setupContext(context);
        Localization localization = new Localization(webApplicationContext);

        // Add empty item before each all.
        List<SimpleItem> items = getItems();
        items.add(0, new SimpleItem(String.format("(%s)", localization.getMessage("label.select")), ""));
        context.put("items", items);
    }
}
