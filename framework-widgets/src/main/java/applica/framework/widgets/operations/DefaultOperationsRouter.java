package applica.framework.widgets.operations;

import applica.framework.Entity;
import applica.framework.Query;
import applica.framework.Result;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.Consumer;
import java.util.function.Function;

public class DefaultOperationsRouter implements OperationsRouter {

    private List<OperationRoute<? extends Entity>> operationRoutes = new ArrayList<>();

    @Override
    public <T extends Entity> void registerFetchListRoute(Class<T> entityType, Function<Query, Result<T>> fn) {
        if (operationRoutes.stream().anyMatch(r -> r.getType().equals(OperationRoute.OperationType.FETCH_LIST) && r.getEntityType().equals(entityType))) {
            throw new RuntimeException("Operation fetchList route already registered for entity: " + entityType.getSimpleName());
        }
        operationRoutes.add(OperationRoute.buildFetchList(entityType, fn));
    }

    @Override
    public <T extends Entity> void registerFetchOneRoute(Class<T> entityType, Function<Object, T> fn) {
        if (operationRoutes.stream().anyMatch(r -> r.getType().equals(OperationRoute.OperationType.FETCH_ONE) && r.getEntityType().equals(entityType))) {
            throw new RuntimeException("Operation fetchOne route already registered for entity: " + entityType.getSimpleName());
        }
        operationRoutes.add(OperationRoute.buildFetchOne(entityType, (Function<Object, T>) fn));
    }

    @Override
    public <T extends Entity> void registerPersistRoute(Class<T> entityType, Consumer<T> fn) {
        if (operationRoutes.stream().anyMatch(r -> r.getType().equals(OperationRoute.OperationType.PERSIST) && r.getEntityType().equals(entityType))) {
            throw new RuntimeException("Operation persist route already registered for entity: " + entityType.getSimpleName());
        }
        operationRoutes.add(OperationRoute.buildPersist(entityType, fn));
    }

    @Override
    public <T extends Entity> void registerRemoveRoute(Class<T> entityType, Consumer<Object> fn) {
        if (operationRoutes.stream().anyMatch(r -> r.getType().equals(OperationRoute.OperationType.REMOVE) && r.getEntityType().equals(entityType))) {
            throw new RuntimeException("Operation remove route already registered for entity: " + entityType.getSimpleName());
        }
        operationRoutes.add(OperationRoute.buildRemove(entityType, fn));
    }

    @Override
    public Optional<Function<Query, Result<? extends Entity>>> getFetchListRoute(Class<? extends Entity> entityType) {
        return operationRoutes.stream()
                .filter(r -> r.getType().equals(OperationRoute.OperationType.FETCH_LIST) && r.getEntityType().equals(entityType))
                .map(OperationRoute::getFetchListFunction)
                .findFirst();
    }

    @Override
    public Optional<Function<Object, ? extends Entity>> getFetchOneRoute(Class<? extends Entity> entityType) {
        var op = operationRoutes.stream()
                .filter(r -> r.getType().equals(OperationRoute.OperationType.FETCH_ONE) && r.getEntityType().equals(entityType))
                .map(OperationRoute::getFetchOneFunction)
                .findFirst()
                .orElse(null);

        return Optional.ofNullable(op);
    }

    @Override
    public Optional<Consumer<? extends Entity>> getPersistRoute(Class<? extends Entity> entityType) {
        var op = operationRoutes.stream()
                .filter(r -> r.getType().equals(OperationRoute.OperationType.PERSIST) && r.getEntityType().equals(entityType))
                .map(OperationRoute::getPersistFunction)
                .findFirst()
                .orElse(null);

        return Optional.ofNullable(op);
    }

    @Override
    public Optional<Consumer<Object>> getRemoveRoute(Class<? extends Entity> entityType) {
            return operationRoutes.stream()
                    .filter(r -> r.getType().equals(OperationRoute.OperationType.REMOVE) && r.getEntityType().equals(entityType))
                    .map(OperationRoute::getRemoveFunction)
                    .findFirst();
    }
}
