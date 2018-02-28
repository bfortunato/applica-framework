package applica.framework.library.dynaobject;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by bimbobruno on 11/16/17.
 */
public class BaseDynamicObject implements DynamicObject {

    private List<Property> properties = new ArrayList<>();

    @Override
    @JsonIgnore
    public Object getProperty(String key) {
        return properties
                .stream()
                .filter(p -> p.getKey().equals(key))
                .findFirst()
                .map(p -> p.getValue())
                .orElse(null);
    }

    @Override
    @JsonIgnore
    public synchronized void setProperty(String key, Object value) {
        Property p = properties
                .stream()
                .filter(pf -> pf.getKey().equals(key))
                .findFirst()
                .orElseGet(() -> {
                    Property np = new Property();
                    np.setKey(key);
                    properties.add(np);
                    return np;
        });

        p.setValue(value);
    }

    @Override
    public synchronized void removeProperty(String key) {
        properties.removeIf(p -> p.getKey().equals(key));
    }

    @Override
    public synchronized void clearProperties() {
        properties.clear();
    }

    public List<Property> getProperties() {
        return properties;
    }

    public void setProperties(List<Property> properties) {
        this.properties = properties;
    }

    public ObjectNode toObjectNode(ObjectMapper mapper) {
        ObjectNode node = mapper.createObjectNode();

        properties.forEach(p -> node.putPOJO(p.getKey(), p.getValue()));

        return node;
    }
}
