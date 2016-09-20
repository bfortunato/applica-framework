package applica.framework.library.options;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.util.Assert;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class PropertiesOptionManager implements OptionsManager {

    private Properties properties;
    private Map<String, String> cache = new HashMap<>();

    private String path = "/WEB-INF/options.properties";

    @Autowired
    private ResourceLoader resourceLoader;

    @PostConstruct
    private void init() throws IOException {
        properties = new Properties();
        Assert.notNull(path);

        if(path.startsWith("env:")) {
            path = "file:///".concat(System.getenv(path.substring(4)));
        }

        Resource res = resourceLoader.getResource(path);
        load(res.getInputStream());
    }

    public void load(InputStream inputStream) throws IOException {
        if (properties == null) {
            properties = new Properties();
        }
        properties.load(inputStream);
        inputStream.close();
    }

    public void load(Properties properties) {
        this.properties = properties;
    }

    @Override
    public String get(String key) {
        String environment = properties.getProperty("environment", "");
        String fullKey = String.format("%s.%s", environment, key);
        String value = getFromCache(fullKey);
        if (value == null) {
            value = properties.getProperty(fullKey, properties.getProperty(key));
            if (StringUtils.isNotEmpty(value)) {
                Pattern pattern = Pattern.compile("\\$\\{\\S+\\}*", Pattern.CASE_INSENSITIVE);
                Matcher matcher = pattern.matcher(value);
                while (matcher.find()) {
                    String var = matcher.group();
                    String varOption = var.substring(2, var.length() - 1);
                    String childValue = get(varOption);

                    if (StringUtils.isNotEmpty(childValue)) {
                        value = value.replaceAll(String.format("\\$\\{%s\\}", varOption), childValue);
                    }
                }
            }

            putInCache(fullKey, value);
        }

        return value;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public void putInCache(String key, String value) {
        if (!cache.containsKey(key)) {
            cache.put(key, value);
        }
    }

    public String getFromCache(String key) {
        if (cache.containsKey(key)) {
            return cache.get(key);
        }

        return null;
    }
}
