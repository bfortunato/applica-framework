package applica.framework.widgets.operations;

import applica.framework.*;
import applica.framework.fileserver.FileServer;
import applica.framework.library.responses.Response;
import applica.framework.library.utils.ProgramException;
import applica.framework.library.utils.SystemOptionsUtils;
import applica.framework.security.Security;
import applica.framework.security.authorization.AuthorizationException;
import applica.framework.security.utils.PermissionUtils;
import applica.framework.widgets.acl.CrudPermission;
import applica.framework.widgets.annotations.File;
import applica.framework.widgets.annotations.Image;
import applica.framework.widgets.mapping.EntityMapper;
import applica.framework.widgets.utils.ClassUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

public class BaseDeleteOperation implements DeleteOperation {

    private Class<? extends Entity> entityType;

    @Autowired
    private FileServer fileServer;

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

        List<Field> fieldList = ClassUtils.getAllFields(getEntityType());

        fieldList.stream().filter(f -> (f.getAnnotation(Image.class) != null || f.getAnnotation(File.class) != null)).forEach(f -> {
            try {
                String value = (String) f.get(deletedEntity);
                if (StringUtils.hasLength(value)) {
                    fileServer.deleteFile(value);
                }

            } catch (Exception e) {

            }
        });
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
