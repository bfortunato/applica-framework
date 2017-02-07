package applica.framework.widgets.operations;

import applica.framework.*;
import applica.framework.library.utils.ProgramException;
import applica.framework.widgets.serialization.DefaultResultSerializer;
import applica.framework.widgets.serialization.ResultSerializer;
import applica.framework.widgets.serialization.SerializationException;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;

public class DefaultFindOperation implements FindOperation {

    @Autowired
    private RepositoriesFactory repositoriesFactory;

    private Repository repository;
    private Class<? extends Entity> entityType;

    private void init() {
        repository = repositoriesFactory.createForEntity(getEntityType());
    }

    public Class<? extends Entity> getEntityType() {
        return entityType;
    }

    public void setEntityType(Class<? extends Entity> type) {
        this.entityType = type;
    }

    @Override
    public ObjectNode find(Query query) throws OperationException {
        if (entityType == null) throw new ProgramException("Entity entityType is null");

        if (repository == null) {
            init();
        }

        if (repository == null) throw new ProgramException("Missing repository");


        Result<Entity> result = repository.find(query);
        ObjectNode node = serialize(result);

        return node;
    }

    private ObjectNode serialize(Result<Entity> result) throws OperationException {
        ResultSerializer serializer = new DefaultResultSerializer(getEntityType());
        try {
            return serializer.serialize(result);
        } catch (SerializationException e) {
            throw new OperationException(e);
        }
    }
}
