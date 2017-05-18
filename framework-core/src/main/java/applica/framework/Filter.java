package applica.framework;

import org.apache.commons.collections.MapUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map.Entry;

/**
 * Describe a filter
 */
public class Filter{

    public static final String LIKE = "like";
    public static final String GT = "gt";
    public static final String NE = "ne";
    public static final String GTE = "gte";
    public static final String LT = "lt";
    public static final String LTE = "lte";
    public static final String EQ = "eq";
    public static final String IN = "in";
    public static final String LIN = "lin";
    public static final String NIN = "nin";
    public static final String LNIN = "lnin";
    public static final String ID = "id";
    public static final String OR = "or";
    public static final String AND = "and";
    public static final String CUSTOM = "custom";
    public static final String RANGE = "range";
    public static final String GEO = "geo";

    private String property;
    private Object value;
    private String type = EQ;

    public Filter() {
        super();
    }

    public Filter(String property, Object value) {
        super();
        this.property = property;
        this.value = value;
    }

    public Filter(String property, Object value, String type) {
        this.property = property;
        this.value = value;
        this.type = type;
    }

    public String getProperty() {
        return property;
    }

    public void setProperty(String property) {
        this.property = property;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public static List<Filter> create(Object... params) {
        List<Filter> filters = new ArrayList<>();
        HashMap<Object, Object> map = new HashMap<>();
        MapUtils.putAll(map, params);
        for (Entry<Object, Object> item : map.entrySet()) {
            filters.add(new Filter(item.getKey().toString(), item.getValue()));
        }

        return filters;
    }

    public static List<Filter> createTyped(Object... params) {
        List<Filter> filters = new ArrayList<>();
        HashMap<Object, Object> map = new HashMap<>();
        MapUtils.putAll(map, params);
        for (Entry<Object, Object> item : map.entrySet()) {
            filters.add(new Filter(item.getKey().toString(), item.getValue()));
        }

        return filters;
    }


}
