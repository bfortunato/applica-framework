package applica.framework.library.tests.data;

import applica.framework.Entity;
import applica.framework.Query;
import applica.framework.Result;
import applica.framework.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 31/10/14
 * Time: 12:44
 */
public abstract class MockRepository<T extends Entity> implements Repository<T> {

    private List<T> entities = new ArrayList<>();

    @Override
    public Optional<T> get(Object id) {
        return entities.stream().filter(f -> f.getId().equals(id)).findFirst();
    }

    @Override
    public Result<T> find(Query request) {
        Result<T> response = new Result<>();
        response.setTotalRows(entities.size());
        response.setRows(entities);
        return response;
    }

    @Override
    public void save(T entity) {
        entities.add(entity);
    }

    @Override
    public void delete(Object id) {

    }
}
