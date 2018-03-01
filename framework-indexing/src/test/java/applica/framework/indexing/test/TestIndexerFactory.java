package applica.framework.indexing.test;

import applica.framework.Entity;
import applica.framework.indexing.core.Indexer;
import applica.framework.indexing.services.IndexerFactory;

import java.util.Optional;

public class TestIndexerFactory implements IndexerFactory {
    @Override
    public <T extends Entity> Optional<Indexer<T>> create(Class<T> entityType) {
        return Optional.of((Indexer<T>) new TestIndexer());
    }
}
