package applica.framework.widgets.operations;

import applica.framework.*;
import applica.framework.library.responses.Response;
import applica.framework.library.utils.ProgramException;
import applica.framework.library.utils.SystemOptionsUtils;
import applica.framework.security.EntityService;
import applica.framework.security.Security;
import applica.framework.security.authorization.AuthorizationException;
import applica.framework.security.utils.PermissionUtils;
import applica.framework.widgets.acl.CrudPermission;
import applica.framework.widgets.annotations.Materialization;
import applica.framework.widgets.mapping.EntityMapper;
import applica.framework.widgets.serialization.DefaultEntitySerializer;
import applica.framework.widgets.serialization.EntitySerializer;
import applica.framework.widgets.serialization.SerializationException;
import applica.framework.widgets.utils.ClassUtils;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

public class BaseGetOperation implements GetOperation {

    @Autowired(required = false)
    private EntityMapper entityMapper;
    private Class<? extends Entity> entityType;

    @Autowired(required = false)
    private EntityService entityService;

    @Override
    public ObjectNode get(Object id) throws OperationException {
        if (getEntityType() == null) throw new ProgramException("Entity entityType is null");

        Entity entity = fetch(id);


        try {
            authorize(entity);
        } catch (AuthorizationException ex) {
            throw new OperationException(Response.UNAUTHORIZED, ex.getMessage());
        }


        ObjectNode node = null;
        if (entity != null) {
            node = serialize(entity);

            finishNode(entity, node);
        }

        return node;
    }

    public void authorize(Entity entity) throws AuthorizationException {
        if (SystemOptionsUtils.isEnabled("crud.authorization.enabled")) {
            PermissionUtils.authorize(Security.withMe().getLoggedUser(), "entity", CrudPermission.EDIT, getEntityType(), entity);
        }
    }


    @Override
    public Entity fetch(Object id) throws OperationException {

        Entity e = Repo.of(this.getEntityType()).get(id).orElse(null);
        materializeFields(e,entityService);

        return e;
    }

    public static void materializeFields(Entity e, EntityService entityService) {
        if (e == null)
            return;
        List<Field> fieldList = ClassUtils.getAllFields(e.getClass());
        if (entityService != null) {
            fieldList.stream().filter(f -> f.getAnnotation(Materialization.class) != null).forEach(f -> {
                entityService.materializePropertyFromId(Arrays.asList(e), f.getName(), f.getAnnotation(Materialization.class).entityField(), f.getAnnotation(Materialization.class).entityClass());
            });
        }
    }

    public static void materializeFields(Entity e) {

        EntityService entityService = ApplicationContextProvider.provide().getBean(EntityService.class);
        materializeFields(e, entityService);
    }


    protected void finishNode(Entity entity, ObjectNode node) throws OperationException {

    }

    protected EntityMapper map() {
        Objects.requireNonNull(entityMapper, "EntityMapper is null. Did you add a bean in application context configuration?");

        return entityMapper;
    }

    protected ObjectNode serialize(Entity entity) throws OperationException {
        EntitySerializer serializer = new DefaultEntitySerializer(getEntityType());
        try {
            ObjectNode data = serializer.serialize(entity);
            return data;
        } catch (SerializationException e) {
            throw new OperationException(Response.ERROR_SERIALIZATION, e);
        }
    }

    public Class<? extends Entity> getEntityType() {
        return entityType;
    }

    public void setEntityType(Class<? extends Entity> entityType) {
        this.entityType = entityType;
    }
}
