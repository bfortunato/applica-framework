package applica.framework.data;

import applica.framework.Entity;
import applica.framework.Query;
import applica.framework.Repository;
import applica.framework.Result;
import applica.framework.library.cache.Cache;
import applica.framework.library.cache.MemoryCache;
import applica.framework.library.utils.Nulls;

import java.util.Optional;

/**
 * Created by bimbobruno on 27/09/2017.
 */
public class CachedRepository<T extends Entity> implements Repository<T> {

    private Repository<T> concreteRepository;
    private Cache cache = new MemoryCache();

    public CachedRepository(Repository<T> concreteRepository) {
        this.concreteRepository = concreteRepository;
    }

    @Override
    public Optional<T> get(Object id) {
        T entity = ((T) cache.get(id.toString()));
        if (entity != null) {
            return Optional.of(entity);
        } else {
            entity = concreteRepository.get(id).orElse(null);
            if (entity != null) {
                cache.put(id.toString(), entity);
                return Optional.of(entity);
            }
        }

        return Optional.empty();
    }

    @Override
    public Result<T> find(Query request) {
        return find(request);
    }

    @Override
    public void save(T entity) {
        if (entity.getId() != null) {
            cache.invalidate(entity.getId().toString());
        }

        concreteRepository.save(entity);
    }

    @Override
    public void delete(Object id) {
        cache.invalidate(id.toString());

        concreteRepository.delete(id);
    }

    @Override
    public Class<T> getEntityType() {
        return concreteRepository.getEntityType();
    }

    @Override
    public Query keywordQuery(Query initialQuery) {
        return concreteRepository.keywordQuery(initialQuery);
    }
}
