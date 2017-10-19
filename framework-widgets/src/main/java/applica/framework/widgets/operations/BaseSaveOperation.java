package applica.framework.widgets.operations;

import applica.framework.Entity;
import applica.framework.Repo;
import applica.framework.Repository;
import applica.framework.library.responses.Response;
import applica.framework.library.utils.ProgramException;
import applica.framework.library.validation.Validation;
import applica.framework.library.validation.ValidationException;
import applica.framework.widgets.mapping.EntityMapper;
import applica.framework.widgets.serialization.DefaultEntitySerializer;
import applica.framework.widgets.serialization.EntitySerializer;
import applica.framework.widgets.serialization.SerializationException;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Objects;

public class BaseSaveOperation implements SaveOperation {

    @Autowired(required = false)
    private EntityMapper entityMapper;

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

        EntitySerializer serializer = new DefaultEntitySerializer(getEntityType());
        try {
            Entity entity = serializer.deserialize(data);

            finishEntity(data, entity);

            validate(entity);
            beforeSave(data, entity);
            persist(entity);
            afterSave(data, entity);

            return entity;
        } catch (SerializationException e) {
            e.printStackTrace();
            throw new OperationException(Response.ERROR_SERIALIZATION);
        }
    }

    public void validate(Entity entity) throws ValidationException {
        Validation.validate(entity);
    }

    protected void beforeSave(ObjectNode data, Entity entity) throws OperationException {

    }

    protected void persist(Entity entity) throws OperationException {
        ((Repository) Repo.of(getEntityType())).save(entity);
    }

    protected void afterSave(ObjectNode node, Entity entity) throws OperationException {

    }

    protected void finishEntity(ObjectNode node, Entity entity) throws OperationException {

    }

    protected EntityMapper map() {
        Objects.requireNonNull(entityMapper, "EntityMapper is null. Did you add a bean in application context configuration?");

        return entityMapper;
    }
}
