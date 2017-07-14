package applica.framework;

import applica.framework.builders.QueryBuilder;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.Predicate;
import org.springframework.util.StringUtils;

import java.util.*;

/**
 * Contains informations for a repository to load data from a database, filters, paginations and sorts
 */
public class Query {

    private int page;
    private int rowsPerPage;
    private String keyword;
    private List<Sort> sorts = new ArrayList<>();
    private List<Filter> filters = new ArrayList<>();

    public static QueryBuilder build(Query initialQuery) {
        return new QueryBuilder(initialQuery);
    }
    public static QueryBuilder build() {
        return new QueryBuilder();
    }

    public QueryBuilder builder() {
        return new QueryBuilder(this);
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getRowsPerPage() {
        return rowsPerPage;
    }

    public void setRowsPerPage(int rowsPerPage) {
        this.rowsPerPage = rowsPerPage;
    }

    public List<Sort> getSorts() {
        return sorts;
    }

    public void setSorts(List<Sort> sorts) {
        this.sorts = sorts;
    }

    public List<Filter> getFilters() {
        return filters;
    }

    public void setFilters(List<Filter> filters) {
        this.filters = filters;
    }

    public Map<String, Object> filtersMap() {
        Map<String, Object> data = new HashMap<String, Object>();
        List<Filter> filterList = filters;

        for(Filter f : filters){

            List<Object> objects = new ArrayList<>();
            int duplicateFilters = 0;
            for(Filter f1 : filterList){
                if(f1.getProperty() != null) {
                    if (f1.getProperty().equals(f.getProperty())) {
                        duplicateFilters++;
                        objects.add(f1.getValue());
                    }
                }
            }
            if(duplicateFilters>1){
                data.put(f.getProperty(), objects);
            } else {
                data.put(f.getProperty(), f.getValue());
            }
        }

        return data;
    }

    public static Query fromJSON(String loadRequestJSON) {
        ObjectMapper mapper = new ObjectMapper();
        Query request = new Query();

        try {
            if (StringUtils.hasLength(loadRequestJSON)) {
                request = mapper.readValue(loadRequestJSON, Query.class);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return request;
    }

    public String getFilterType(String property) {
        if (this.hasFilter(property)) {
            return this.getFilters().stream().filter(f -> f.getProperty().equals(property)).findFirst().get().getType();
        } else {
            return null;
        }

    }


    public Object getFilterValue(final String property) {
        Filter filter = (Filter) CollectionUtils.find(filters, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                return property.equals(((Filter) item).getProperty());
            }
        });

        if (filter != null) return filter.getValue();
        return null;
    }

    public boolean hasFilter(final String property) {
        Filter filter = (Filter) CollectionUtils.find(filters, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                return property.equals(((Filter) item).getProperty());
            }
        });

        return filter != null;
    }

    public Optional<Filter> peekFilter(final String property) {
        Filter filter = (Filter) CollectionUtils.find(filters, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                return property.equals(((Filter) item).getProperty());
            }
        });

        return Optional.ofNullable(filter);
    }

    public Optional<Filter> popFilter(final String property) {
        Filter filter = (Filter) CollectionUtils.find(filters, new Predicate() {
            @Override
            public boolean evaluate(Object item) {
                return property.equals(((Filter) item).getProperty());
            }
        });

        if (filter != null) {
            filters.remove(filter);
        }

        return Optional.ofNullable(filter);
    }

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }
}
