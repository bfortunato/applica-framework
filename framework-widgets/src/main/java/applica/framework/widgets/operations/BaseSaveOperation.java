package applica.framework.widgets.operations;

import applica.framework.Entity;
import applica.framework.Repo;
import applica.framework.Repository;
import applica.framework.library.responses.Response;
import applica.framework.library.utils.ProgramException;
import applica.framework.library.utils.SystemOptionsUtils;
import applica.framework.library.validation.Validation;
import applica.framework.library.validation.ValidationException;
import applica.framework.library.validation.ValidationResult;
import applica.framework.security.CodeGeneratorService;
import applica.framework.security.NumericCodedEntity;
import applica.framework.security.Security;
import applica.framework.security.authorization.AuthorizationException;
import applica.framework.security.utils.PermissionUtils;
import applica.framework.widgets.acl.CrudPermission;
import applica.framework.widgets.annotations.Image;
import applica.framework.widgets.annotations.Materialization;
import applica.framework.widgets.entities.EntitiesRegistry;
import applica.framework.widgets.entities.EntityId;
import applica.framework.widgets.mapping.EntityMapper;
import applica.framework.widgets.serialization.DefaultEntitySerializer;
import applica.framework.widgets.serialization.EntitySerializer;
import applica.framework.widgets.serialization.SerializationException;
import applica.framework.widgets.utils.ClassUtils;
import applica.framework.widgets.utils.ValidationUtils;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.commons.beanutils.PropertyUtils;
import org.springframework.beans.factory.annotation.Autowired;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class BaseSaveOperation implements SaveOperation {

    @Autowired(required = false)
    private EntityMapper entityMapper;

    @Autowired(required = false)
    private CodeGeneratorService codeGeneratorService;

    public void validate(Entity entity) throws ValidationException {
        validate(entity, new ValidationResult());
    }

    public void validate(Entity entity, ValidationResult result) throws ValidationException {

        ValidationUtils.validate(entity, result, true);

        if (!result.isValid()) {
            throw new ValidationException(result);
        }
    }

    private Class<? extends Entity> entityType;

    @Override
    public Class<? extends Entity> getEntityType() {
        return entityType;
    }

    public void setEntityType(Class<? extends Entity> entityType) {
        this.entityType = entityType;
    }

    @Override
    public Entity save(ObjectNode data) throws OperationException, ValidationException {
        if (getEntityType() == null) throw new ProgramException("Entity entityType is null");
        try {

            beforeSerialize(data);
            Entity entity = generateEntity(data);

            authorize(entity);

            validate(entity);
            beforeSave(data, entity);
            persist(entity);
            afterSave(data, entity);

            return entity;
        } catch (SerializationException e) {
            e.printStackTrace();
            throw new OperationException(Response.ERROR_SERIALIZATION);
        } catch (AuthorizationException e) {
            throw new OperationException(Response.UNAUTHORIZED, e.getMessage());
        }
    }

    public Entity generateEntity(ObjectNode data) throws SerializationException, OperationException {

        EntitySerializer serializer = new DefaultEntitySerializer(getEntityType());
        Entity entity =serializer.deserialize(data);

        finishEntity(data, entity);

        return entity;
    }

    public void beforeSerialize(ObjectNode data) {

    }

    public void authorize(Entity entity) throws AuthorizationException {
        if (SystemOptionsUtils.isEnabled("crud.authorization.enabled"))
            PermissionUtils.authorize(Security.withMe().getLoggedUser(), "entity", CrudPermission.SAVE, getEntityType(), entity);

    }


    protected void beforeSave(ObjectNode data, Entity entity) throws OperationException {

    }

    @Override
    public void persist(Entity entity) throws OperationException {
        ((Repository) Repo.of(getEntityType())).save(entity);
    }

    protected void afterSave(ObjectNode node, Entity entity) throws OperationException {

    }


    protected EntityMapper map() {
        Objects.requireNonNull(entityMapper, "EntityMapper is null. Did you add a bean in application context configuration?");

        return entityMapper;
    }


    protected void finishEntity(ObjectNode node, Entity entity) throws OperationException {
        List<Field> fieldList = ClassUtils.getAllFields(getEntityType());

        fieldList.stream().filter(f -> f.getAnnotation(Materialization.class) != null && f.getAnnotation(Materialization.class).reverseMaterialization()).forEach(f -> {
            try {
                PropertyUtils.setProperty(entity, f.getName(), getMaterializedPropertyId(f, entity));
            } catch (IllegalAccessException | InvocationTargetException | NoSuchMethodException e) {
                e.printStackTrace();
            }
        });

        fieldList.stream().filter(f -> f.getAnnotation(Image.class) != null).forEach(f -> {
            entityMapper.dataUrlToImage(node, entity, f.getAnnotation(Image.class).nodeProperty(),  f.getName(), f.getAnnotation(Image.class).path());
        });

        if (codeGeneratorService != null) {
            if(entity instanceof NumericCodedEntity && (entity.getId() == null || ((NumericCodedEntity) entity).getCode() == 0) && isCodeAutoGenerationEnabled()) {
                ((NumericCodedEntity) entity).setCode(codeGeneratorService.getFirstAvailableCode((Class<? extends NumericCodedEntity>) getEntityType(), ((NumericCodedEntity) entity).generateQueryForCodeProgressive()));
            }
        }
    }

    private Object getMaterializedPropertyId(Field f, Entity entity) {
        Object materialized = null;
        try {
            materialized = PropertyUtils.getProperty(entity, f.getAnnotation(Materialization.class).entityField());
            if (materialized != null) {
                if (materialized instanceof List)
                    return ((List<?>) materialized).stream().map( e -> ((Entity) e).getId()).collect(Collectors.toList());
                return ((Entity) materialized).getId();
            }
            return null;

        } catch (Exception e) {
            return null;
        }

    }

    private boolean isCodeAutoGenerationEnabled() {
        return EntitiesRegistry.instance().get(getEntityType()).get().getType().getAnnotation(EntityId.class).automaticCodeGeneration();
    }
}
