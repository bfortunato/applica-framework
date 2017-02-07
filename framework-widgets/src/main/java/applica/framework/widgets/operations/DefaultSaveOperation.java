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

public class DefaultSaveOperation implements SaveOperation {

    @Autowired
    private RepositoriesFactory repositoriesFactory;

    private Repository repository;
    private Class<? extends Entity> entityType;

    private void init() {
        repository = repositoriesFactory.createForEntity(getEntityType());
    }

    @Override
    public Class<? extends Entity> getEntityType() {
        return entityType;
    }

    public void setEntityType(Class<? extends Entity> entityType) {
        this.entityType = entityType;
    }

    @Override
    public void save(ObjectNode data) throws OperationException {
        if (entityType == null) throw new ProgramException("Entity entityType is null");

        if (repository == null) {
            init();
        }

        if (repository == null) throw new ProgramException("Missing repository");

        EntitySerializer serializer = new DefaultEntitySerializer(getEntityType());
        try {
            Entity entity = serializer.deserialize(data);

            repository.save(entity);

        } catch (SerializationException e) {
            throw new OperationException(e);
        }
    }
}
