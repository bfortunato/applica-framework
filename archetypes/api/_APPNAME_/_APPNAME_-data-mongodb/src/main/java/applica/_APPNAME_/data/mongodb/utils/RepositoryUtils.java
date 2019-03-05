package applica._APPNAME_.data.mongodb.utils;

import applica.framework.Entity;
import applica.framework.Query;
import org.bson.types.ObjectId;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class RepositoryUtils {

    public static List<ObjectId> getRepositoryIdFromIds(List<String> ids) {
        if (ids != null && ids.size() > 0)
            return ids.stream().map(ObjectId::new).collect(Collectors.toList());
        return new ArrayList<>();
    }

    public static List<ObjectId> getRepositoryIdFromEntities(List<? extends Entity> entities) {
        if (entities != null && entities.size() > 0)
            return getRepositoryIdFromIds(entities.stream().map(e -> ((String) e.getId())).collect(Collectors.toList()));
        return new ArrayList<>();
    }

    public static List<String> getIdsFromEntities(List<? extends Entity> entities) {
        if (entities != null && entities.size() > 0)
            return entities.stream().map(e -> ((String) e.getId())).collect(Collectors.toList());
        return new ArrayList<>();
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
}
