package applica.framework;

import applica.framework.builders.Statement;

import java.util.Optional;

/**
 * Allowed filters
 * like: username
 */
public interface Repository<T extends Entity> {

    Optional<T> get(Object id);
    Object sum(Query request, String value);
    Object avg(Query request, String value);
    Result<T> find(Query request);
    Statement<T> find(Filter... filters);
    void save(T entity);
    void delete(Object id);
    void deleteMany(Query request);
    Class<T> getEntityType();
    Query keywordQuery(Query initialQuery);

}
