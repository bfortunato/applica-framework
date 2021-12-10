package applica.framework;

import applica.framework.builders.QueryBuilder;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.Predicate;
import org.springframework.util.StringUtils;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.util.*;

/**
 * Contains informations for a repository to load data from a database, filters, paginations and sorts
 */
public class Query {

    private int page;
    private int rowsPerPage;
    private String keyword;
    //TODO: implementare il supporto a questo parametro anche su Hibernate. Spostarlo fuori da query ? trovare un sistema per gestirlo direttamente dai metodi della crudStrategy magari
    private boolean ignoreNestedReferences;
    private List<Sort> sorts = new ArrayList<>();
    private List<Filter> filters = new ArrayList<>();
    private List<Projection> projections = new ArrayList<>();
    private Object extra;

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

    public static <T> T alias(Class<T> baseClass) {
        return (T) Proxy.newProxyInstance(baseClass.getClassLoader(), new Class[]{ baseClass }, new InvocationHandler() {
            @Override
            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                if (method.getParameterCount() == 0) {
                    if (method.getName().startsWith("get") && method.getName().length() > 0) {
                        String name = method.getName().substring(3);
                        StringBuilder sb = new StringBuilder(name);
                        sb.setCharAt(0, Character.toLowerCase(sb.charAt(0)));

                        return sb.toString();
                    }
                }

                throw new RuntimeException("Cannot call this method. Alias class");
            }
        });
    }

    public List<Projection> getProjections() {
        return projections;
    }

    public void setProjections(List<Projection> projections) {
        this.projections = projections;
    }

    public boolean isIgnoreNestedReferences() {
        return ignoreNestedReferences;
    }

    public void setIgnoreNestedReferences(boolean ignoreNestedReferences) {
        this.ignoreNestedReferences = ignoreNestedReferences;
    }

    public Object getExtra() {
        return extra;
    }

    public void setExtra(Object extra) {
        this.extra = extra;
    }
}
