package applica.framework;

/**
 * Created by bimbobruno on 17/09/15.
 */
public interface CrudStrategy {

    <T extends Entity> T get(Object id, Repository<T> repository);

    <T extends Entity> Result<T> find(Query query, Repository<T> repository);

    <T extends Entity> void save(T entity, Repository<T> repository);

    <T extends Entity> void delete(Object id, Repository<T> repository);

    <T extends Entity> void deleteMany(Query query, Repository<T> repository);

    <T extends Entity> Object sum(Query request, String field, Repository<T> repository);

    <T extends Entity> Object avg(Query request, String field, Repository<T> repository);

    <T extends Entity> long count(Query query, Repository<T> repository);

}
