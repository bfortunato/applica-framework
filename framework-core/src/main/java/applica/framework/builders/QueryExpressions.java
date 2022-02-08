package applica.framework.builders;

import applica.framework.Filter;
import applica.framework.Projection;
import applica.framework.Sort;

import java.util.Arrays;

public class QueryExpressions {

    public static Filter like(String property, Object value) {
        return new Filter(property, value, Filter.LIKE);
    }

    public static Filter exact(String property, Object value) {
        return new Filter(property, value, Filter.EXACT);
    }

    public static Filter gt(String property, Object value) {
        return new Filter(property, value, Filter.GT);
    }

    public static Filter gte(String property, Object value) {
        return new Filter(property, value, Filter.GTE);
    }

    public static Filter lt(String property, Object value) {
        return new Filter(property, value, Filter.LT);
    }

    public static Filter exixts(String property, Object value) {
        return new Filter(property, value, Filter.EXISTS);
    }

    public static Filter range(String property, Object value) {
        return new Filter(property, value, Filter.RANGE);
    }

    public static Filter lte(String property, Object value) {
        return new Filter(property, value, Filter.LTE);
    }

    public static Filter eq(String property, Object value) {
        return new Filter(property, value, Filter.EQ);
    }

    public static Filter ne(String property, Object value) {
        return new Filter(property, value, Filter.NE);
    }

    public static Filter in(String property, Object value) {
        return new Filter(property, value, Filter.IN);
    }

    public static Filter nin(String property, Object value) {
        return new Filter(property, value, Filter.NIN);
    }

    public static Filter id(String property, Object value) {
        return new Filter(property, value, Filter.ID);
    }

    public static Filter id(Object value) {
        return new Filter("id", value, Filter.ID);
    }

    public static Filter and(Filter... filters) {
        return new Filter(null, Arrays.asList(filters), Filter.AND);
    }

    public static Filter or(Filter... filters) {
        return new Filter(null, Arrays.asList(filters), Filter.OR);
    }

    public static Sort asc(String property) {
        return new Sort(property, false);
    }

    public static Sort desc(String property) {
        return new Sort(property, true);
    }

    public static Projection include(String property) {
        return new Projection(property, true);
    }

    public static Projection exclude(String property) {
        return new Projection(property, false);
    }

    public static Filter[] nullCheck(Filter... filters) {
        return Arrays.stream(filters).filter(f -> f.getValue() != null).toArray(Filter[]::new);
    }
}

