package applica.framework.data.mongodb.constraints;

import applica.framework.*;
import applica.framework.library.utils.TypeUtils;
import org.apache.commons.beanutils.PropertyUtils;
import org.springframework.beans.factory.annotation.Autowired;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.List;
import java.util.Objects;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 30/10/14
 * Time: 11:49
 */
public abstract class ForeignKeyConstraint<T1 extends Entity, T2 extends Entity> implements ReferencedConstraint<T1, T2> {
    /*
    public enum Cascade {
        DELETE,
        CHECK
    }*/

    @Autowired
    private RepositoriesFactory repositoriesFactory;

    public RepositoriesFactory getRepositoriesFactory() {
        return repositoriesFactory;
    }

    public void setRepositoriesFactory(RepositoriesFactory repositoriesFactory) {
        this.repositoriesFactory = repositoriesFactory;
    }

    /**
     * Returns a LoadRequest for check in checkPrimary() function.
     * By default, entire entity collection was loaded.
     * You can specify an optimized query to load optimized data.
     * LoadRequest is user by foreign repository. Primary type entity was passed as parameter of builder
     * @return
     */
    protected LoadRequest getOptimizedLoadRequest(T1 primaryEntity) {
        return LoadRequest.build();
    }
/*
    public Cascade getCascade() {
        return Cascade.CHECK;
    }
*/
    /**
     * Check if primary key entity is used by some foreign key.
     * This check is commonly used in deletions
     * @param entity
     * @throws ConstraintException
     */
    @Override
    public void checkPrimary(T1 entity) throws ConstraintException {
        Objects.requireNonNull(entity, "Entity cannot be null");
        Objects.requireNonNull(getForeignProperty(), "Foreign property cannot be null");
        Objects.requireNonNull(getForeignType(), "Foreign type cannot be null");
        Object id = entity.getId();

        try {
            if (id != null) {
                Repository<? extends Entity> foreignRepository = repositoriesFactory.createForEntity(getForeignType());
                for (Entity foreignEntity : foreignRepository.find(getOptimizedLoadRequest(entity)).getRows()) {
                    Field foreignValueField = TypeUtils.getField(getForeignType(), getForeignProperty());
                    Object foreignValue = PropertyUtils.getProperty(foreignEntity, getForeignProperty());
                    if (foreignValue != null) {
                        if (TypeUtils.isList(foreignValueField.getType())) {
                            Type listGenericType = TypeUtils.getFirstGenericArgumentType(((ParameterizedType) foreignValueField.getGenericType()));
                            if (getPrimaryType().equals(listGenericType)) {
                                List<? extends Entity> list = (List) foreignValue;
                                for (Entity el : list) {
                                    if (id.equals(el.getId())) {
                                        throw new ConstraintException(
                                                String.format("ForeignKey check failure: %s [%s] was found in %s.%s",
                                                        getPrimaryType().getName(),
                                                        el.getId(),
                                                        getForeignType().getName(),
                                                        getForeignProperty()
                                                )
                                        );
                                    }
                                }
                            } else if (String.class.equals(listGenericType) ||
                                    Integer.class.equals(listGenericType) ||
                                    Long.class.equals(listGenericType) ||
                                    Key.class.equals(listGenericType)) {
                                List<?> list = (List) foreignValue;
                                for (Object possibleId : list) {
                                    Object foreignId = Key.class.equals(foreignValueField.getType()) ? ((Key) possibleId).getValue() : possibleId;
                                    if (id.equals(foreignId)) {
                                        throw new ConstraintException(
                                                String.format("ForeignKey check failure: %s [%s] was found in %s.%s",
                                                        getPrimaryType().getName(),
                                                        id,
                                                        getForeignType().getName(),
                                                        getForeignProperty()
                                                )
                                        );
                                    }
                                }
                            }
                        }  else if (getPrimaryType().equals(foreignValueField.getType())) {
                            Entity value = ((Entity) foreignValue);
                            if (value != null) {
                                if (id.equals(value.getId())) {
                                    throw new ConstraintException(
                                            String.format("ForeignKey check failure: %s [%s] was found in %s.%s",
                                                    getPrimaryType().getName(),
                                                    id,
                                                    getForeignType().getName(),
                                                    getForeignProperty()
                                            )
                                    );
                                }
                            }

                        } else if (String.class.equals(foreignValueField.getType()) ||
                                Integer.class.equals(foreignValueField.getType()) ||
                                Long.class.equals(foreignValueField.getType()) ||
                                Key.class.equals(foreignValueField.getType())) {
                            Object foreignId = Key.class.equals(foreignValueField.getType()) ? ((Key) foreignValue).getValue() : foreignValue;
                            if (id.equals(foreignId)) {
                                throw new ConstraintException(
                                        String.format("ForeignKey check failure: %s [%s] was found in %s.%s",
                                                getPrimaryType().getName(),
                                                id,
                                                getForeignType().getName(),
                                                getForeignProperty()
                                        )
                                );
                            }
                        }
                    }
                }
            }
        } catch (NoSuchFieldException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }
    }

    /**
     * Check if primary entity id stored in foreign property exists
     * @param foreignEntity
     */
    @Override
    public void checkForeign(T2 foreignEntity) throws ConstraintException {
        Objects.requireNonNull(foreignEntity, "Entity cannot be null");
        Objects.requireNonNull(getPrimaryType(), "Primary type cannot be null");
        Objects.requireNonNull(getForeignProperty(), "Foreign property cannot be null");
        Objects.requireNonNull(getForeignType(), "Foreign type cannot be null");

        try {
            Field foreignValueField = TypeUtils.getField(getForeignType(), getForeignProperty());
            Object foreignValue = PropertyUtils.getProperty(foreignEntity, getForeignProperty());
            if (foreignValue != null) {
                if (TypeUtils.isList(foreignValueField.getType())) {
                    Type listGenericType = TypeUtils.getFirstGenericArgumentType((ParameterizedType) foreignValueField.getGenericType());
                    if (getPrimaryType().equals(listGenericType)) {
                        Repository<? extends Entity> repository = repositoriesFactory.createForEntity(getPrimaryType());
                        List<? extends Entity> list = (List) foreignValue;
                        for (Entity el : list) {
                            repository.get(el.getId()).orElseThrow(() -> new ConstraintException(
                                    String.format("ForeignKey check failure: %s.%s [%s] was found in %s",
                                            getForeignType().getName(),
                                            getForeignProperty(),
                                            el.getId(),
                                            getPrimaryType().getName()
                                    )
                            ));
                        }
                    } else if (String.class.equals(listGenericType) ||
                            Integer.class.equals(listGenericType) ||
                            Long.class.equals(listGenericType) ||
                            Key.class.equals(listGenericType)) {
                        Repository<? extends Entity> repository = repositoriesFactory.createForEntity(getPrimaryType());
                        List<?> list = (List) foreignValue;
                        for (Object possibleId : list) {
                            Object id = Key.class.equals(listGenericType) ? ((Key) possibleId).getValue() : possibleId;
                            repository.get(id).orElseThrow(() -> new ConstraintException(
                                    String.format("ForeignKey check failure: %s.%s [%s] was found in %s",
                                            getForeignType().getName(),
                                            getForeignProperty(),
                                            id,
                                            getPrimaryType().getName()
                                    )
                            ));
                        }
                    }
                } else if (getPrimaryType().equals(foreignValueField.getType())) {
                    Repository<? extends Entity> repository = repositoriesFactory.createForEntity(getPrimaryType());
                    Entity value = ((Entity) foreignValue);
                    if (value != null) {
                        repository.get(value.getId()).orElseThrow(() -> new ConstraintException(
                                String.format("ForeignKey check failure: %s.%s [%s] was not found in %s",
                                        getForeignType().getName(),
                                        getForeignProperty(),
                                        value.getId(),
                                        getPrimaryType().getName()
                                )
                        ));
                    }
                } else if (String.class.equals(foreignValueField.getType()) ||
                        Integer.class.equals(foreignValueField.getType()) ||
                        Long.class.equals(foreignValueField.getType()) ||
                        Key.class.equals(foreignValueField.getType())) {
                    Object id = Key.class.equals(foreignValueField.getType()) ? ((Key) foreignValue).getValue() : foreignValue;
                    Repository<? extends Entity> repository = repositoriesFactory.createForEntity(getPrimaryType());
                    repository.get(id).orElseThrow(() -> new ConstraintException(
                            String.format("ForeignKey check failure: %s.%s [%s] was found in %s",
                                    getForeignType().getName(),
                                    getForeignProperty(),
                                    id,
                                    getPrimaryType().getName()
                            )
                    ));
                }
            }

        } catch (NoSuchFieldException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }
    }
}
