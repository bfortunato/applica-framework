package applica.framework.builders;

import applica.framework.Filter;
import applica.framework.Query;
import applica.framework.Sort;

public class QueryBuilder extends Query {



    @FunctionalInterface
    public interface ConditionalFilterPredicate {
        boolean check();
    }

    public QueryBuilder() {
        this(null);
    }

    public QueryBuilder(Query initialQuery) {
        if (initialQuery != null) {
            setFilters(initialQuery.getFilters());
            setKeyword(initialQuery.getKeyword());
            setPage(initialQuery.getPage());
            setRowsPerPage(initialQuery.getRowsPerPage());
            setSorts(initialQuery.getSorts());
        }
    }

    public static QueryBuilder build() {
        return new QueryBuilder();
    }

    public void fill(Query query) {
        query.setFilters(getFilters());
        query.setKeyword(getKeyword());
        query.setPage(getPage());
        query.setRowsPerPage(getRowsPerPage());
        query.setSorts(getSorts());
    }

    public QueryBuilder filter(String property, Object value) {
        if(value != null) {
            getFilters().add(new Filter(property, value));
        }
        return this;
    }

    public QueryBuilder filter(String property, Object value, String type) {
        if(value != null) {
            getFilters().add(new Filter(property, value, type));
        }
        return this;
    }

    public QueryBuilder filterIf(String property, Object value, String type, ConditionalFilterPredicate predicate) {
        if(value != null) {
            if (predicate.check()) {
                getFilters().add(new Filter(property, value, type));
            }
        }
        return this;
    }

    public QueryBuilder filterIf(String property, Object value, ConditionalFilterPredicate predicate) {
        return filterIf(property, value, Filter.EQ, predicate);
    }

    public QueryBuilder like(String property, Object value) {
        if(value != null) {
            getFilters().add(new Filter(property, value, Filter.LIKE));
        }
        return this;
    }

    public QueryBuilder exact(String property, Object value) {
        if(value != null) {
            getFilters().add(new Filter(property, value, Filter.EXACT));
        }
        return this;
    }

    public QueryBuilder gt(String property, Object value) {
        if(value != null) {
            getFilters().add(new Filter(property, value, Filter.GT));
        }
        return this;
    }

    public QueryBuilder gte(String property, Object value) {
        if(value != null) {
            getFilters().add(new Filter(property, value, Filter.GTE));
        }
        return this;
    }

    public QueryBuilder lt(String property, Object value) {
        if(value != null) {
            getFilters().add(new Filter(property, value, Filter.LT));
        }
        return this;
    }

    public QueryBuilder exixts(String property, Object value) {
        if(value != null) {
            getFilters().add(new Filter(property, value, Filter.EXISTS));
        }
        return this;
    }

    public QueryBuilder range(String property, Object value) {
        if(value != null) {
            getFilters().add(new Filter(property, value, Filter.RANGE));
        }
        return this;
    }

    public QueryBuilder lte(String property, Object value) {
        if(value != null) {
            getFilters().add(new Filter(property, value, Filter.LTE));
        }
        return this;
    }

    public QueryBuilder eq(String property, Object value) {
        if(value != null) {
            getFilters().add(new Filter(property, value, Filter.EQ));
        }
        return this;
    }

    public QueryBuilder ne(String property, Object value) {
        if(value != null) {
            getFilters().add(new Filter(property, value, Filter.NE));
        }
        return this;
    }

    public QueryBuilder in(String property, Object value) {
        if(value != null) {
            getFilters().add(new Filter(property, value, Filter.IN));
        }
        return this;
    }

    public QueryBuilder nin(String property, Object value) {
        if(value != null) {
            getFilters().add(new Filter(property, value, Filter.NIN));
        }
        return this;
    }

    public QueryBuilder id(String property, Object value) {
        if(value != null) {
            getFilters().add(new Filter(property, value, Filter.ID));
        }
        return this;
    }

    public QueryBuilder id(Object value) {
        if(value != null) {
            getFilters().add(new Filter(null, value, Filter.ID));
        }
        return this;
    }

    public QueryBuilder sort(String property, boolean descending) {
        getSorts().add(new Sort(property, descending));
        return this;
    }

    /**
     * Begins to create an OR filter. When is complete, call finish() method to get current loadRequestBuilder
     * @return
     */
    public DisjunctionBuilder disjunction() {
        return DisjunctionBuilder.begin(this);
    }


    public ConjunctionBuilder conjunction() {
        return ConjunctionBuilder.begin(this);
    }



    public QueryBuilder page(int page) {
        setPage(page);
        return this;
    }

    public QueryBuilder rowsPerPage(int rowsPerPage) {
        setRowsPerPage(rowsPerPage);
        return this;
    }

    public QueryBuilder keyword(String keyword) {
        setKeyword(keyword);
        return this;
    }

    public Query get() {
        return this;
    }





}
