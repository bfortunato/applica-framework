package applica.framework.widgets.operations;

import applica.framework.ApplicationContextProvider;
import applica.framework.Entity;
import applica.framework.Query;
import applica.framework.Result;
import applica.framework.library.utils.LangUtils;
import applica.framework.widgets.operations.annotations.FetchListRoute;
import applica.framework.widgets.operations.annotations.FetchOneRoute;
import applica.framework.widgets.operations.annotations.PersistRoute;
import applica.framework.widgets.operations.annotations.RemoveRoute;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.velocity.runtime.Runtime;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.type.filter.AnnotationTypeFilter;
import org.springframework.core.type.filter.AssignableTypeFilter;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.Consumer;
import java.util.function.Function;

import static applica.framework.library.utils.LangUtils.unchecked;

public class DefaultOperationsRouter implements OperationsRouter {

    private Log logger = LogFactory.getLog(getClass());

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

    @Override
    public void scan(Package... packages) {
        logger.info("Scanning packages for operation routes...");

        ClassPathScanningCandidateComponentProvider scanner = new ClassPathScanningCandidateComponentProvider(false);
        scanner.addIncludeFilter(new AnnotationTypeFilter(Service.class));
        scanner.addIncludeFilter(new AnnotationTypeFilter(Component.class));

        for (Package myPackage : packages) {
            logger.info(" ********** Scanning package " + myPackage.getName() + " **********");
            for (BeanDefinition bean : scanner.findCandidateComponents(myPackage.getName())) {
                logger.info("Bean definition found " + bean.getBeanClassName());
                try {
                    Class<?> type = Class.forName(bean.getBeanClassName());
                    var serviceInstance = ApplicationContextProvider.provide().getBean(type);

                    if (serviceInstance == null) {
                        throw new RuntimeException("serviceInstance is null");
                    }

                    for (var method : type.getDeclaredMethods()) {
                        var fetchOne = method.getAnnotation(FetchOneRoute.class);
                        if (fetchOne != null) {
                            registerFetchOneRoute((Class<Entity>) fetchOne.entityType(), e -> unchecked(() -> ((Entity) method.invoke(serviceInstance, e))));
                        }

                        var fetchListRoute = method.getAnnotation(FetchListRoute.class);
                        if (fetchListRoute != null) {
                            registerFetchListRoute((Class<Entity>) fetchListRoute.entityType(), e -> unchecked(() -> (Result<Entity>) method.invoke(serviceInstance, e)));
                        }

                        var persistRoute = method.getAnnotation(PersistRoute.class);
                        if (persistRoute != null) {
                            registerPersistRoute(persistRoute.entityType(), e -> unchecked(() -> method.invoke(serviceInstance, e)));
                        }

                        var removeRoute = method.getAnnotation(RemoveRoute.class);
                        if (removeRoute != null) {
                            registerRemoveRoute(removeRoute.entityType(), e -> unchecked(() -> method.invoke(serviceInstance, e)));
                        }
                    }

                } catch (ClassNotFoundException e) {
                    logger.error("Error loading class type for bean definition");
                    e.printStackTrace();
                }
            }
        }
    }
}
