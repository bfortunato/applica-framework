package applica.framework.widgets.utils;

import applica.framework.Disjunction;
import applica.framework.Filter;
import applica.framework.Query;

public class FilterUtils {

    public static void addBooleanFilter(String filterName, Query query) {
        Filter f = null;
        if (query.hasFilter(filterName)) {
            Object value = query.getFilterValue(filterName);
            if (value instanceof Boolean) {
                return;
            }
            if (value != null && value.equals("true")){
                f = new Filter(filterName, query.getFilterValue(filterName).equals("true"), query.getFilterType(filterName));
            } else {
                f = createBooleanFalseOrNotExistingFilter(filterName);
            }
            query.getFilters().removeIf(fi -> fi.getProperty().equals(filterName));
            query.getFilters().add(f);
        }

    }

    public static void addIntegerFilter(String name, Query query) {
        if (query.hasFilter(name)) {
            Filter newFilter = new Filter(name, Integer.parseInt(query.getFilterValue(name).toString()), query.getFilterType(name));
            query.popFilter(name);
            query.getFilters().add(newFilter);

        }
    }


    public static Filter createBooleanFalseOrNotExistingFilter(String property) {
        Disjunction disjunction = new Disjunction();
        disjunction.getChildren().add(new Filter(property, false));
        disjunction.getChildren().add(new Filter(property, false, Filter.EXISTS));
        return disjunction;

    }

    public static Query createOverlapFilter(Object start, Object end, String startFilter, String endFilter) {

        //Condizione 1: la data iniziale dell'entità da cercare è compresa nell'intervallo startDate-endDate
        //Condizione 2: la data finale dell'entità è compresa nell'intervallo startDate-endDate
        //Condizione 3: data iniziale e finale dell'entità includono interamente l'intervallo startDate-endDate
        //Condizione 4: l'intervallo di date della entità è interamente compreso
        return Query.build()
                .disjunction()
                .conjunction().gte(startFilter, start).lte(startFilter, end).finishIntermediateFilter()
                .conjunction().gte(endFilter, start).lte(endFilter, end).finishIntermediateFilter()
                .conjunction().lte(startFilter, start).gte(endFilter, end).finishIntermediateFilter()
                .conjunction().gte(startFilter, start).lte(endFilter, end).finishIntermediateFilter()
                .finish();
    }

    public static Query createQueryWithPaginationInfos(Integer page, Integer rowsPerPage) {
        Query query = Query.build();
        fillQueryWithPaginationInfos(query, page, rowsPerPage);
        return query;
    }

    public static void fillQueryWithPaginationInfos(Query query, Integer page, Integer rowsPerPage) {
        if (query == null)
            query = Query.build();
        if (page != null && page > 0 && rowsPerPage != null) {
            query.setPage(page);
            query.setRowsPerPage(rowsPerPage);
        }
    }


    public static void addNumberFilter(String name, Query query) {
        if (query.hasFilter(name)) {
            Filter newFilter = new Filter(name, Double.parseDouble(query.getFilterValue(name).toString()), query.getFilterType(name));
            query.popFilter(name);
            query.getFilters().add(newFilter);

        }
    }
}
