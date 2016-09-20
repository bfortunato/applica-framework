package applica.framework.builders;

import applica.framework.Filter;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by applica on 10/28/15.
 */
public class CriteriaBuilder extends Filter {


    protected final LoadRequestBuilder loadRequestBuilder;
    //campo per individuare il criterio padre
    //serve per gestire operazioni logiche annidate e puo essere Conjunction o disjunction
    protected final CriteriaBuilder parentBuilder;

    public CriteriaBuilder(String filterType, LoadRequestBuilder loadRequestBuilder, CriteriaBuilder parentBuilder) {
        setType(filterType);
        setValue(new ArrayList<Filter>());

        this.loadRequestBuilder = loadRequestBuilder;
        this.parentBuilder = parentBuilder;

    }

    public List<Filter> getChildren() {
        return (List<Filter>) getValue();
    }

    public void setChildren(List<Filter> children) {
        setValue(children);
    }

    public CriteriaBuilder disjunction() {
        return DisjunctionBuilder.begin(loadRequestBuilder, this);
    }

    public CriteriaBuilder conjunction() {
        return ConjunctionBuilder.begin(loadRequestBuilder, this);
    }


    public LoadRequestBuilder finish() {
        loadRequestBuilder.getFilters().add(this);

        return loadRequestBuilder;
    }

    public CriteriaBuilder finishIntermediateFilter() {
        parentBuilder.getChildren().add(this);

        return parentBuilder;
    }

    public CriteriaBuilder filter(String property, Object value) {
        if(value != null) {
            getChildren().add(new Filter(property, value));
        }
        return this;
    }

    public CriteriaBuilder filter(String property, Object value, String type) {
        if(value != null) {
            getChildren().add(new Filter(property, value, type));
        }
        return this;
    }

    public CriteriaBuilder like(String property, Object value) {
        if(value != null) {
            getChildren().add(new Filter(property, value, Filter.LIKE));
        }
        return this;
    }

    public CriteriaBuilder gt(String property, Object value) {
        if(value != null) {
            getChildren().add(new Filter(property, value, Filter.GT));
        }
        return this;
    }

    public CriteriaBuilder gte(String property, Object value) {
        if(value != null) {
            getChildren().add(new Filter(property, value, Filter.GTE));
        }
        return this;
    }

    public CriteriaBuilder lt(String property, Object value) {
        if(value != null) {
            getChildren().add(new Filter(property, value, Filter.LT));
        }
        return this;
    }

    public CriteriaBuilder lte(String property, Object value) {
        if(value != null) {
            getChildren().add(new Filter(property, value, Filter.LTE));
        }
        return this;
    }

    public CriteriaBuilder eq(String property, Object value) {
        if(value != null) {
            getChildren().add(new Filter(property, value, Filter.EQ));
        }
        return this;
    }

    public CriteriaBuilder in(String property, Object value) {
        if(value != null) {
            getChildren().add(new Filter(property, value, Filter.IN));
        }
        return this;
    }

    public CriteriaBuilder lin(String property, Object value) {
        if(value != null) {
            getChildren().add(new Filter(property, value, Filter.LIN));
        }
        return this;
    }

    public CriteriaBuilder nin(String property, Object value) {
        if(value != null) {
            getChildren().add(new Filter(property, value, Filter.NIN));
        }
        return this;
    }

    public CriteriaBuilder lnin(String property, Object value) {
        if(value != null) {
            getChildren().add(new Filter(property, value, Filter.LNIN));
        }
        return this;
    }

    public CriteriaBuilder id(String property, Object value) {
        if(value != null) {
            getChildren().add(new Filter(property, value, Filter.ID));
        }
        return this;
    }

    public CriteriaBuilder id(Object value) {
        if(value != null) {
            getChildren().add(new Filter(null, value, Filter.ID));
        }
        return this;
    }

}
