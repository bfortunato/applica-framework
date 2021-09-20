package applica.framework.data;

import applica.framework.*;
import applica.framework.builders.Statement;
import applica.framework.library.cache.Cache;
import applica.framework.library.cache.MemoryCache;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
    public Optional<T> getMultiple(Object id) {
        T entity = ((T) cache.get(id.toString()));
        if (entity != null) {
            return Optional.of(entity);
        } else {
            entity = concreteRepository.getMultiple(id).orElse(null);
            if (entity != null) {
                cache.put(id.toString(), entity);
                return Optional.of(entity);
            }
        }

        return Optional.empty();
    }

    @Override
    public Result<T> find(Query request) {
        return concreteRepository.find(request);
    }

    @Override
    public List<T> getMultiple(List<Object> ids) {
        ids = new ArrayList<>(ids);
        ids.removeIf(id ->  id == null || !org.springframework.util.StringUtils.hasLength(id.toString()));

        if (ids.size() == 0)
            return new ArrayList<>();

        return ids.stream().map(id -> this.getMultiple(id).orElse(null)).collect(Collectors.toList());
    }

    @Override
    public Statement<T> find(Filter... filters) {
        return concreteRepository.find(filters);
    }

    @Override
    public void save(T entity) {
        if (entity.getId() != null) {
            cache.invalidate(entity.getId().toString());
        }

        concreteRepository.save(entity);
    }

    @Override
    public Object sum(Query request, String value) {
        return concreteRepository.sum(request, value);
    }

    @Override
    public Object avg(Query request, String value) {
        return concreteRepository.avg(request, value);
    }

    @Override
    public void delete(Object id) {
        cache.invalidate(id.toString());

        concreteRepository.delete(id);
    }

    @Override
    public void deleteMany(Query request) {
        concreteRepository.find(request).getRows().forEach(c -> {
            cache.invalidate(c.getId().toString());
        });
        concreteRepository.deleteMany(request);
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
