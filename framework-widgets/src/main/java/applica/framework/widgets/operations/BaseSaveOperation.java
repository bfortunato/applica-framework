package applica.framework.widgets.operations;

import applica.framework.Entity;
import applica.framework.Repo;
import applica.framework.RepositoriesFactory;
import applica.framework.Repository;
import applica.framework.library.utils.ProgramException;
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
    public void save(ObjectNode data) throws OperationException {
        if (getEntityType() == null) throw new ProgramException("Entity entityType is null");

        EntitySerializer serializer = new DefaultEntitySerializer(getEntityType());
        try {
            Entity entity = serializer.deserialize(data);

            finishEntity(data, entity);

            persist(entity);

            afterSave(data, entity);
        } catch (SerializationException e) {
            throw new OperationException(e);
        }
    }

    private void persist(Entity entity) {
        ((Repository) Repo.of(getEntityType())).save(entity);
    }

    protected void afterSave(ObjectNode node, Entity entity) {

    }

    protected void finishEntity(ObjectNode node, Entity entity) {

    }

    protected EntityMapper map() {
        Objects.requireNonNull(entityMapper, "EntityMapper is null. Did you add a bean in application context configuration?");

        return entityMapper;
    }
}
