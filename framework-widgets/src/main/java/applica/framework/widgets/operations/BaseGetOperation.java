package applica.framework.widgets.operations;

import applica.framework.*;
import applica.framework.library.responses.Response;
import applica.framework.library.utils.ProgramException;
import applica.framework.library.utils.SystemOptionsUtils;
import applica.framework.library.utils.TypeUtils;
import applica.framework.security.EntityService;
import applica.framework.security.Security;
import applica.framework.security.authorization.AuthorizationException;
import applica.framework.security.utils.PermissionUtils;
import applica.framework.widgets.acl.CrudPermission;
import applica.framework.widgets.annotations.File;
import applica.framework.widgets.annotations.Image;
import applica.framework.widgets.annotations.JsonMaterialization;
import applica.framework.widgets.annotations.Materialization;
import applica.framework.widgets.mapping.EntityMapper;
import applica.framework.widgets.serialization.DefaultEntitySerializer;
import applica.framework.widgets.serialization.EntitySerializer;
import applica.framework.widgets.serialization.SerializationException;
import applica.framework.widgets.utils.ClassUtils;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;

import java.lang.reflect.Field;
import java.lang.reflect.ParameterizedType;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;

public class BaseGetOperation implements GetOperation {

    @Autowired(required = false)
    private EntityMapper entityMapper;

    @Autowired(required = false)
    private OperationsRouter router;

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

        return getFromEntity(entity);
    }

    @Override
    public ObjectNode getFromEntity(Entity entity) throws OperationException  {

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
        Function<Object, ? extends Entity> fn;
        Entity e;
        if (router != null && (fn = router.getFetchOneRoute(entityType).orElse(null)) != null) {
            e = fn.apply(id);
        } else {
            e = Repo.of(getEntityType()).get(id).orElse(null);
        }

        materialize(e);

        return e;
    }

    public void materialize(Entity e) {
        materializeFields(e,entityService);
    }

    public static void materializeFields(Entity e, EntityService entityService) {
        if (e == null)
            return;
        List<Field> fieldList = ClassUtils.getAllFields(e.getClass());
        if (entityService != null && fieldList != null) {
            fieldList.stream().filter(f -> f.getAnnotation(Materialization.class) != null).forEach(f -> {
                entityService.materializePropertyFromId(Arrays.asList(e), f.getName());
            });
        }
    }


    public static void materializeFields(Entity e) {
        EntityService entityService = ApplicationContextProvider.provide().getBean(EntityService.class);
        materializeFields(e, entityService);
    }


    protected void finishNode(Entity entity, ObjectNode node) throws OperationException {
        List<Field> fieldList = ClassUtils.getAllFields(getEntityType());

        materializeJson(fieldList, entity, node);

        fieldList.stream().filter(f -> f.getAnnotation(Image.class) != null).forEach(f -> {
            EntityMapper mapper = ApplicationContextProvider.provide().getBean(EntityMapper.class);
            mapper.imageToDataUrl(entity, node, f.getName(), f.getAnnotation(Image.class).nodeProperty(), f.getAnnotation(Image.class).size());
        });

        fieldList.stream().filter(f -> f.getAnnotation(File.class) != null).forEach(f -> {
            EntityMapper mapper = ApplicationContextProvider.provide().getBean(EntityMapper.class);
            mapper.fileToDataUrl(entity, node, f.getName(), f.getAnnotation(File.class).nodeProperty());
        });
    }

    protected void materializeJson(List<Field> fields, Entity entity, ObjectNode node) {
        try {
            for (var field : fields) {
                var jsonMaterialization = field.getAnnotation(JsonMaterialization.class);
                if (jsonMaterialization != null) {
                    if (Arrays.asList(jsonMaterialization.operations()).contains(Operations.GET)) {
                        var source = field.get(entity);
                        if (source != null) {
                            if (TypeUtils.isListOfEntities(field.getGenericType())) {
                                map().entitiesToIds(entity, node, field.getName(), jsonMaterialization.destination());
                            } else if (TypeUtils.isEntity(field.getType())) {
                                map().entityToId(entity, node, field.getName(), jsonMaterialization.destination());
                            } else if (source instanceof List) {
                                map().idsToEntities(entity, node, field.getName(), jsonMaterialization.destination(), jsonMaterialization.entityType());
                            } else {
                                map().idToEntity(entity, node, jsonMaterialization.entityType(), field.getName(), jsonMaterialization.destination());
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    protected void materializeJson(Entity entity, ObjectNode node) {
        materializeJson(ClassUtils.getAllFields(getEntityType()), entity, node);
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
