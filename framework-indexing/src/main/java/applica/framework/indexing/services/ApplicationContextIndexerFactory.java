package applica.framework.indexing.services;

import applica.framework.Entity;
import applica.framework.indexing.core.Indexer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

import java.util.Objects;
import java.util.Optional;

public class ApplicationContextIndexerFactory implements IndexerFactory {

    @Autowired
    private ApplicationContext applicationContext;

    @Override
    public <T extends Entity> Optional<Indexer<T>> create(Class<T> entityType) {
        return applicationContext.getBeansOfType(Indexer.class)
                .values()
                .stream()
                .filter(i -> Objects.equals(i.getEntityType(), entityType))
                .findFirst()
                .map(i -> (Indexer<T>) i);

    }
}
