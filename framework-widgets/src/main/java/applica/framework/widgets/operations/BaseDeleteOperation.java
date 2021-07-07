package applica.framework.widgets.operations;

import applica.framework.Entity;
import applica.framework.Repo;
import applica.framework.RepositoriesFactory;
import applica.framework.Repository;
import applica.framework.library.responses.Response;
import applica.framework.library.utils.ProgramException;
import applica.framework.library.utils.SystemOptionsUtils;
import applica.framework.security.Security;
import applica.framework.security.authorization.AuthorizationException;
import applica.framework.security.utils.PermissionUtils;
import applica.framework.widgets.acl.CrudPermission;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

public class BaseDeleteOperation implements DeleteOperation {

    private Class<? extends Entity> entityType;

    @Override
    public void delete(String id) throws OperationException {
        delete(Arrays.asList(id));
    }

    @Override
    public void delete(List<String> ids) throws OperationException {
        if (getEntityType() == null) throw new ProgramException("Entity entityType is null");

        for (String id : ids) {
            try {
                remove(id);
            } catch (OperationException e) {
                throw e;
            } catch (Exception e) {
                throw new OperationException(Response.ERROR, e);
            }
        }
    }

    public void afterDelete(Entity deletedEntity) throws OperationException {

    }

    public void beforeDelete(Entity entityToDelete) throws OperationException {

    }

    public void remove(Object id) throws OperationException {
        Entity entity = Repo.of(getEntityType()).get(id).get();
        try {
            authorize(entity);
        } catch (AuthorizationException e) {
            throw new OperationException(Response.UNAUTHORIZED, e.getMessage());
        }
        beforeDelete(entity);
        performRemove(entity);
        afterDelete(entity);
    }

    public void performRemove(Entity entity) {
        Repo.of(getEntityType()).delete(entity.getId());
    }

    public void authorize(Entity entity) throws AuthorizationException {
        if (SystemOptionsUtils.isEnabled("crud.authorization.enabled")) {
            PermissionUtils.authorize(Security.withMe().getLoggedUser(), "entity", CrudPermission.DELETE, getEntityType(), entity);
        }
    }

    public Class<? extends Entity> getEntityType() {
        return entityType;
    }

    public void setEntityType(Class<? extends Entity> entityType) {
        this.entityType = entityType;
    }
}