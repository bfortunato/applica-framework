package applica.framework.widgets.operations;

import applica.framework.Entity;
import applica.framework.Query;
import applica.framework.Result;

import java.util.function.Consumer;
import java.util.function.Function;

public class OperationRoute<T extends Entity> {

    public enum OperationType {
        FETCH_ONE,
        FETCH_LIST,
        REMOVE,
        PERSIST,
    }

    private OperationType type;
    private Class<T> entityType;
    private Function<Query, Result<? extends Entity>> fetchListFunction;
    private Function<Object, T> fetchOneFunction;
    private Consumer<T> persistFunction;
    private Consumer<Object> removeFunction;

    public static <T extends Entity> OperationRoute<T> buildFetchList(Class<T> entityType, Function<Query, Result<T>> fetchListFunction) {
        var route = new OperationRoute<T>();
        route.type = OperationType.FETCH_LIST;
        route.entityType = entityType;
        route.fetchListFunction = (q) -> fetchListFunction.apply(q);
        return route;
    }

    public static <T extends Entity> OperationRoute<T> buildFetchOne(Class<T> entityType, Function<Object, T> fetchOneFunction) {
        var route = new OperationRoute<T>();
        route.type = OperationType.FETCH_ONE;
        route.entityType = entityType;
        route.fetchOneFunction = fetchOneFunction;
        return route;
    }

    public static <T extends Entity> OperationRoute<T> buildPersist(Class<T> entityType, Consumer<T> persistFunction) {
        var route = new OperationRoute<T>();
        route.type = OperationType.PERSIST;
        route.entityType = entityType;
        route.persistFunction = persistFunction;
        return route;
    }

    public static <T extends Entity> OperationRoute<T> buildRemove(Class<T> entityType, Consumer<Object> removeFunction) {
        var route = new OperationRoute<T>();
        route.type = OperationType.REMOVE;
        route.entityType = entityType;
        route.removeFunction = removeFunction;
        return route;
    }

    public OperationType getType() {
        return type;
    }

    public void setType(OperationType type) {
        this.type = type;
    }

    public Class<? extends Entity> getEntityType() {
        return entityType;
    }

    public void setEntityType(Class<T> entityType) {
        this.entityType = entityType;
    }

    public Function<Query, Result<? extends Entity>> getFetchListFunction() {
        return fetchListFunction;
    }

    public Function<Object, ? extends Entity> getFetchOneFunction() {
        return fetchOneFunction;
    }

    public Consumer<T> getPersistFunction() {
        return persistFunction;
    }

    public Consumer<Object> getRemoveFunction() {
        return removeFunction;
    }

}
