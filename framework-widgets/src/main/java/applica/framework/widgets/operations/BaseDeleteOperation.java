package applica.framework.widgets.operations;

import applica.framework.Entity;
import applica.framework.Repo;
import applica.framework.RepositoriesFactory;
import applica.framework.Repository;
import applica.framework.library.utils.ProgramException;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class BaseDeleteOperation implements DeleteOperation {

    private Class<? extends Entity> entityType;

    @Override
    public void delete(String id) throws OperationException {
        if (getEntityType() == null) throw new ProgramException("Entity entityType is null");

        try {
            remove(id);
        } catch (Exception e) {
            throw new OperationException(e);
        }
    }

    @Override
    public void delete(List<String> ids) throws OperationException {
        if (entityType == null) throw new ProgramException("Entity entityType is null");

        for (String id : ids) {
            try {
                remove(id);
            } catch (Exception e) {
                throw new OperationException(e);
            }
        }
    }

    private void remove(Object id) {
        Repo.of(getEntityType()).delete(id);
    }

    public Class<? extends Entity> getEntityType() {
        return entityType;
    }

    public void setEntityType(Class<? extends Entity> entityType) {
        this.entityType = entityType;
    }
}
