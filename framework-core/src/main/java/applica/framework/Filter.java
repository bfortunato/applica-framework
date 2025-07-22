package applica.framework;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.apache.commons.collections.MapUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map.Entry;

/**
 * Describe a filter
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class Filter {

    @JsonIgnore public static final String REGEX = "regex";
    @JsonIgnore public static final String LIKE = "like";
    @JsonIgnore public static final String NOT_LIKE = "notLike";
    @JsonIgnore public static final String GT = "gt";
    @JsonIgnore public static final String NE = "ne";
    @JsonIgnore public static final String GTE = "gte";
    @JsonIgnore public static final String LT = "lt";
    @JsonIgnore public static final String LTE = "lte";
    @JsonIgnore public static final String EQ = "eq";
    @JsonIgnore public static final String IN = "in";
    @JsonIgnore public static final String LIN = "lin";
    @JsonIgnore public static final String NIN = "nin";
    @JsonIgnore public static final String LNIN = "lnin";
    @JsonIgnore public static final String ID = "id";
    @JsonIgnore public static final String TEXT = "text";
    @JsonIgnore public static final String OR = "or";
    @JsonIgnore public static final String AND = "and";
    @JsonIgnore public static final String CUSTOM = "custom";
    @JsonIgnore public static final String RANGE = "range";
    @JsonIgnore public static final String EXISTS = "exists";
    @JsonIgnore public static final String EXACT = "exact";
    @JsonIgnore public static final String ELEM_MATCH = "elemMatch";

    //GEO-FILTERS: used to apply geometric relationships between geographical coordinates
    @JsonIgnore public static final String GEO_CONTAINS =   "geocontains";
    @JsonIgnore public static final String GEO_EQ =         "geoequals";
    @JsonIgnore public static final String GEO_DISJOINT =   "geodisjoint";
    @JsonIgnore public static final String GEO_INTERSECTS = "geointersects";
    @JsonIgnore public static final String GEO_TOUCHES =    "geotouches";
    @JsonIgnore public static final String GEO_CROSSES =    "geocrosses";
    @JsonIgnore public static final String GEO_WITHIN =     "geowithin";
    @JsonIgnore public static final String GEO_OVERLAPS =   "geooverlaps";
    @JsonIgnore public static final String GEO_WHITHIN =   "geo_near";

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

    @JsonIgnore
    public List<Filter> getChildren() {
        if (!OR.equals(type) && !AND.equals(type)) {
            throw new RuntimeException("Requesting getChildren on non boolean filter");
        }

        return (List<Filter>) value;
    }

    public void setChildren(List<Filter> children) {
        if (!OR.equals(type) && !AND.equals(type)) {
            throw new RuntimeException("Requesting setChildren on non boolean filter");
        }

        value = children;
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
