package applica.framework.indexing.services;

import applica.framework.Entity;
import applica.framework.indexing.core.Indexer;

import java.util.Optional;

public interface IndexerFactory {

    <T extends Entity> Optional<Indexer<T>> create(Class<T> entityType);

}
