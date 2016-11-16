package applica.framework;

import java.util.Optional;

/**
 * Allowed filters
 * like: username
 */
public interface Repository<T extends Entity> {

    Optional<T> get(Object id);
    LoadResponse<T> find(Query request);
    void save(T entity);
    void delete(Object id);
    Class<T> getEntityType();

}
