package applica.framework;

/**
 * Created by bimbobruno on 17/09/15.
 */
public interface CrudStrategy {

    <T extends Entity> T get(Object id, Repository<T> repository);

    <T extends Entity> Result<T> find(Query query, Repository<T> repository);

    <T extends Entity> void save(T entity, Repository<T> repository);

    <T extends Entity> void delete(Object id, Repository<T> repository);

}
