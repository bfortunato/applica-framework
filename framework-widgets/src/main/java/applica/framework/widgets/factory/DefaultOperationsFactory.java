package applica.framework.widgets.factory;

import applica.framework.Entity;
import applica.framework.widgets.operations.*;
import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

import java.util.HashMap;

/**
 * Created by bimbobruno on 19/12/2016.
 */
public class DefaultOperationsFactory implements OperationsFactory {

    private class OperationDefinitions {
        GetOperation get;
        FindOperation find;
        DeleteOperation delete;
        SaveOperation save;
        CreateOperation create;
    }

    @Autowired
    private ApplicationContext applicationContext;

    private HashMap<Class<? extends Entity>, OperationDefinitions> defaultOperations = new HashMap<>();

    @Override
    public GetOperation createGet(Class<? extends Entity> entityType) {
        GetOperation getOperation = null;

        try {
            getOperation = applicationContext.getBeansOfType(GetOperation.class).values().stream()
                    .filter(r -> !(r instanceof DefaultGetOperation))
                    .filter(r -> r.getEntityType().equals(entityType))
                    .findFirst()
                    .orElseThrow(() -> new NoSuchBeanDefinitionException("form processor " + entityType.getName()));
        } catch (NoSuchBeanDefinitionException e) {
            OperationDefinitions def = null;
            if (defaultOperations.containsKey(entityType)) {
                def = defaultOperations.get(entityType);
                if (def.get != null) {
                    return def.get;
                }
            }

            if (def == null) {
                def = new OperationDefinitions();
                defaultOperations.put(entityType, def);
            }

            getOperation = applicationContext.getBean(DefaultGetOperation.class);
            ((DefaultGetOperation) getOperation).setEntityType(entityType);
            def.get = getOperation;
        }

        return getOperation;
    }

    @Override
    public FindOperation createFind(Class<? extends Entity> entityType) {
        FindOperation findOperation = null;

        try {
            findOperation = applicationContext.getBeansOfType(FindOperation.class).values().stream()
                    .filter(r -> !(r instanceof DefaultFindOperation))
                    .filter(r -> r.getEntityType().equals(entityType))
                    .findFirst()
                    .orElseThrow(() -> new NoSuchBeanDefinitionException("form processor " + entityType.getName()));
        } catch (NoSuchBeanDefinitionException e) {
            OperationDefinitions def = null;
            if (defaultOperations.containsKey(entityType)) {
                def = defaultOperations.get(entityType);
                if (def.find != null) {
                    return def.find;
                }
            }

            if (def == null) {
                def = new OperationDefinitions();
                defaultOperations.put(entityType, def);
            }

            findOperation = applicationContext.getBean(DefaultFindOperation.class);
            ((DefaultFindOperation) findOperation).setEntityType(entityType);
            def.find = findOperation;
        }

        return findOperation;
    }

    @Override
    public DeleteOperation createDelete(Class<? extends Entity> entityType) {
        DeleteOperation deleteOperation = null;

        try {
            deleteOperation = applicationContext.getBeansOfType(DeleteOperation.class).values().stream()
                    .filter(r -> !(r instanceof DefaultDeleteOperation))
                    .filter(r -> r.getEntityType().equals(entityType))
                    .findFirst()
                    .orElseThrow(() -> new NoSuchBeanDefinitionException("form processor " + entityType.getName()));
        } catch (NoSuchBeanDefinitionException e) {
            OperationDefinitions def = null;
            if (defaultOperations.containsKey(entityType)) {
                def = defaultOperations.get(entityType);
                if (def.delete != null) {
                    return def.delete;
                }
            }

            if (def == null) {
                def = new OperationDefinitions();
                defaultOperations.put(entityType, def);
            }

            deleteOperation = applicationContext.getBean(DefaultDeleteOperation.class);
            ((DefaultDeleteOperation) deleteOperation).setEntityType(entityType);
            def.delete = deleteOperation;
        }

        return deleteOperation;
    }

    @Override
    public SaveOperation createSave(Class<? extends Entity> entityType) {
        SaveOperation saveOperation = null;

        try {
            saveOperation = applicationContext.getBeansOfType(SaveOperation.class).values().stream()
                    .filter(r -> !(r instanceof DefaultSaveOperation))
                    .filter(r -> r.getEntityType().equals(entityType))
                    .findFirst()
                    .orElseThrow(() -> new NoSuchBeanDefinitionException("form processor " + entityType.getName()));
        } catch (NoSuchBeanDefinitionException e) {
            OperationDefinitions def = null;
            if (defaultOperations.containsKey(entityType)) {
                def = defaultOperations.get(entityType);
                if (def.save != null) {
                    return def.save;
                }
            }

            if (def == null) {
                def = new OperationDefinitions();
                defaultOperations.put(entityType, def);
            }

            saveOperation = applicationContext.getBean(DefaultSaveOperation.class);
            ((DefaultSaveOperation) saveOperation).setEntityType(entityType);
            def.save = saveOperation;
        }

        return saveOperation;
    }


    @Override
    public CreateOperation createCreate(Class<? extends Entity> entityType) {
        CreateOperation createOperation = null;

        try {
            createOperation = applicationContext.getBeansOfType(CreateOperation.class).values().stream()
                    .filter(r -> !(r instanceof DefaultCreateOperation))
                    .filter(r -> r.getEntityType().equals(entityType))
                    .findFirst()
                    .orElseThrow(() -> new NoSuchBeanDefinitionException("form processor " + entityType.getName()));
        } catch (NoSuchBeanDefinitionException e) {
            OperationDefinitions def = null;
            if (defaultOperations.containsKey(entityType)) {
                def = defaultOperations.get(entityType);
                if (def.create != null) {
                    return def.create;
                }
            }

            if (def == null) {
                def = new OperationDefinitions();
                defaultOperations.put(entityType, def);
            }

            createOperation = applicationContext.getBean(DefaultCreateOperation.class);
            ((DefaultCreateOperation) createOperation).setEntityType(entityType);
            def.create = createOperation;
        }

        return createOperation;
    }
}
