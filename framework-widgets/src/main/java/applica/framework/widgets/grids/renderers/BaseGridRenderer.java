package applica.framework.widgets.grids.renderers;

import applica.framework.widgets.Grid;
import applica.framework.library.i18n.Localization;
import applica.framework.widgets.velocity.VelocityGridRenderer;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.velocity.VelocityContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.WebApplicationContext;

import java.io.Writer;
import java.util.List;
import java.util.Map;

public class BaseGridRenderer extends VelocityGridRenderer {
    private Log logger = LogFactory.getLog(getClass());

    @Autowired
    protected WebApplicationContext webApplicationContext;

    private Grid grid = null;

    @Override
    public void render(Writer writer, Grid grid, List<Map<String, Object>> data) {
        this.grid = grid;

        String templatePath = createTemplatePath(grid);
        setTemplatePath(templatePath);

        logger.info("Loading grid template: " + templatePath);

        super.render(writer, grid, data);
    }

    protected String createTemplatePath(Grid grid) {
        String templatePath = "/templates/grid.vm";

        return templatePath;
    }

    @Override
    protected void setupContext(VelocityContext context) {
        Localization localization = new Localization(webApplicationContext);
        context.put("title", localization.getMessage(String.format("crud.grid.title.%s", grid.getIdentifier())));

        super.setupContext(context);
    }


}
