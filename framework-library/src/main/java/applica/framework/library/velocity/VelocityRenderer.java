package applica.framework.library.velocity;

import applica.framework.library.velocity.tools.FrameworkTools;
import org.apache.velocity.VelocityContext;

import java.util.HashMap;
import java.util.Map.Entry;

public class VelocityRenderer {
    private String templatePath;
    private HashMap<String, Object> extraContextValues = new HashMap<>();

    public void putExtraContextValue(String key, Object value) {
        extraContextValues.put(key, value);
    }

    public String getTemplatePath() {
        return templatePath;
    }

    public void setTemplatePath(String templatePath) {
        this.templatePath = templatePath;
    }

    protected void setupContext(VelocityContext context) {
        FrameworkTools tools = new FrameworkTools();
        context.put("framework", tools);
        context.put("localization", tools.getLocalization());
        context.put("wwwBase", tools.getWwwBase());

        for (Entry<String, Object> entry : extraContextValues.entrySet()) {
            context.put(entry.getKey(), entry.getValue());
        }
    }
}
