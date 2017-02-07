package applica.framework.widgets.operations;

import applica.framework.Entity;
import applica.framework.RepositoriesFactory;
import applica.framework.Repository;
import applica.framework.library.utils.ProgramException;
import applica.framework.widgets.serialization.DefaultEntitySerializer;
import applica.framework.widgets.serialization.EntitySerializer;
import applica.framework.widgets.serialization.SerializationException;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;

public class DefaultGetOperation implements GetOperation {

    @Autowired
    private RepositoriesFactory repositoriesFactory;

    private Repository repository;
    private Class<? extends Entity> entityType;

    private void init() {
        repository = repositoriesFactory.createForEntity(getEntityType());
    }

    @Override
    public ObjectNode get(Object id) throws OperationException {
        if (entityType == null) throw new ProgramException("Entity entityType is null");

        if (repository == null) {
            init();
        }

        if (repository == null) throw new ProgramException("Missing repository");

        Entity entity = (Entity) repository.get(id).orElse(null);
        ObjectNode node = null;
        if (entity != null) {
            node = serialize(entity);
        }

        return node;
    }

    private ObjectNode serialize(Entity entity) throws OperationException {
        EntitySerializer serializer = new DefaultEntitySerializer(getEntityType());
        try {
            ObjectNode data = serializer.serialize(entity);
            return data;
        } catch (SerializationException e) {
            throw new OperationException(e);
        }
    }

    public Class<? extends Entity> getEntityType() {
        return entityType;
    }

    public void setEntityType(Class<? extends Entity> entityType) {
        this.entityType = entityType;
    }
}
