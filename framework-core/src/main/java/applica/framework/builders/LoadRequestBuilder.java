package applica.framework.builders;

import applica.framework.Filter;
import applica.framework.LoadRequest;
import applica.framework.Sort;

public class LoadRequestBuilder extends LoadRequest {
    public static LoadRequestBuilder build() {
        return new LoadRequestBuilder();
    }

    public LoadRequestBuilder filter(String property, Object value) {
        if(value != null) {
            getFilters().add(new Filter(property, value));
        }
        return this;
    }

    public LoadRequestBuilder filter(String property, Object value, String type) {
        if(value != null) {
            getFilters().add(new Filter(property, value, type));
        }
        return this;
    }

    public LoadRequestBuilder like(String property, Object value) {
        if(value != null) {
            getFilters().add(new Filter(property, value, Filter.LIKE));
        }
        return this;
    }

    public LoadRequestBuilder gt(String property, Object value) {
        if(value != null) {
            getFilters().add(new Filter(property, value, Filter.GT));
        }
        return this;
    }

    public LoadRequestBuilder gte(String property, Object value) {
        if(value != null) {
            getFilters().add(new Filter(property, value, Filter.GTE));
        }
        return this;
    }

    public LoadRequestBuilder lt(String property, Object value) {
        if(value != null) {
            getFilters().add(new Filter(property, value, Filter.LT));
        }
        return this;
    }

    public LoadRequestBuilder lte(String property, Object value) {
        if(value != null) {
            getFilters().add(new Filter(property, value, Filter.LTE));
        }
        return this;
    }

    public LoadRequestBuilder eq(String property, Object value) {
        if(value != null) {
            getFilters().add(new Filter(property, value, Filter.EQ));
        }
        return this;
    }

    public LoadRequestBuilder in(String property, Object value) {
        if(value != null) {
            getFilters().add(new Filter(property, value, Filter.IN));
        }
        return this;
    }

    public LoadRequestBuilder nin(String property, Object value) {
        if(value != null) {
            getFilters().add(new Filter(property, value, Filter.NIN));
        }
        return this;
    }

    public LoadRequestBuilder id(String property, Object value) {
        if(value != null) {
            getFilters().add(new Filter(property, value, Filter.ID));
        }
        return this;
    }

    public LoadRequestBuilder id(Object value) {
        if(value != null) {
            getFilters().add(new Filter(null, value, Filter.ID));
        }
        return this;
    }

    public LoadRequestBuilder sort(String property, boolean descending) {
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



    public LoadRequestBuilder page(int page) {
        setPage(page);
        return this;
    }

    public LoadRequestBuilder rowsPerPage(int rowsPerPage) {
        setRowsPerPage(rowsPerPage);
        return this;
    }

    public LoadRequest get() {
        return this;
    }





}
