package applica.framework.library.dynaobject;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by bimbobruno on 11/16/17.
 */
public class BaseDynamicObject implements DynamicObject {

    public class Property {
        private String key;
        private Object value;
    }

    private List<Property> properties = new ArrayList<>();

    @Override
    public Object getProperty(String key) {
        return properties
                .stream()
                .filter(p -> p.key.equals(key))
                .findFirst()
                .map(p -> p.value)
                .orElse(null);
    }

    @Override
    public synchronized void setProperty(String key, Object value) {
        Property p = properties
                .stream()
                .filter(pf -> pf.key.equals(key))
                .findFirst()
                .orElseGet(() -> {
                    Property np = new Property();
                    np.key = key;
                    properties.add(np);
                    return np;
        });

        p.value = value;
    }

    @Override
    public synchronized void removeProperty(String key) {
        properties.removeIf(p -> p.key.equals(key));
    }

    @Override
    public synchronized void clearProperties() {
        properties.clear();
    }
}
