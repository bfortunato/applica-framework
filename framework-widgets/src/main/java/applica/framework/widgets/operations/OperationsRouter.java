package applica.framework.widgets.operations;

import applica.framework.Entity;
import applica.framework.Query;
import applica.framework.Result;

import java.util.Optional;
import java.util.function.Consumer;
import java.util.function.Function;

public interface OperationsRouter {

    <T extends Entity> void registerFetchListRoute(Class<T> entityType, Function<Query, Result<T>> fn);
    <T extends Entity> void registerFetchOneRoute(Class<T> entityType, Function<Object, T> fn);
    <T extends Entity> void registerPersistRoute(Class<T> entityType, Consumer<T> fn);
    <T extends Entity> void registerRemoveRoute(Class<T> entityType, Consumer<Object> fn);

    void scan(Package... packages);

    Optional<Function<Query, Result<? extends Entity>>> getFetchListRoute(Class<? extends Entity> entityType);
    Optional<Function<Object, ? extends Entity>> getFetchOneRoute(Class<? extends Entity> entityType);
    Optional<Consumer<? extends Entity>> getPersistRoute(Class<? extends Entity> entityType);
    Optional<Consumer<Object>> getRemoveRoute(Class<? extends Entity> entityType);

}
