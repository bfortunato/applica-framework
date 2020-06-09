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
import applica.framework.widgets.annotations.Search;
import applica.framework.widgets.mapping.EntityMapper;
import applica.framework.widgets.serialization.DefaultResultSerializer;
import applica.framework.widgets.serialization.ResultSerializer;
import applica.framework.widgets.serialization.SerializationException;
import applica.framework.widgets.utils.ClassUtils;
import applica.framework.widgets.utils.FilterUtils;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class BaseFindOperation implements FindOperation, ResultSerializerListener {

    @Autowired(required = false)
    private EntityMapper entityMapper;

    @Autowired(required = false)
    private EntityService entityService;


    private Class<? extends Entity> entityType;

    public Class<? extends Entity> getEntityType() {
        return entityType;
    }

    public void setEntityType(Class<? extends Entity> type) {
        this.entityType = type;
    }

    @Override
    public ObjectNode find(Query query) throws OperationException {
        if (getEntityType() == null) throw new ProgramException("Entity entityType is null");

        try {
            authorize(query);
        } catch (AuthorizationException e) {
            throw new OperationException(Response.UNAUTHORIZED, e.getMessage());
        }

        Result<? extends Entity> result = fetch(query);
        ObjectNode node = serialize(result);

        return node;
    }

    public void authorize(Query query) throws AuthorizationException {
        if (SystemOptionsUtils.isEnabled("crud.authorization.enabled")) {
            PermissionUtils.authorize(Security.withMe().getLoggedUser(), "entity", CrudPermission.LIST, getEntityType(), query);
        }
    }


    protected ObjectNode serialize(Result<? extends Entity> result) throws OperationException {
        ResultSerializer serializer = new DefaultResultSerializer(getEntityType(), this);
        try {
            return serializer.serialize(result);
        } catch (SerializationException e) {
            throw new OperationException(Response.ERROR_SERIALIZATION, e);
        }
    }

    @Override
    public void onSerializeEntity(ObjectNode node, Entity entity) {

    }

    protected EntityMapper map() {
        Objects.requireNonNull(entityMapper, "EntityMapper is null. Did you add a bean in application context configuration?");

        return entityMapper;
    }

    protected Result<? extends Entity> fetch(Query query) throws OperationException {
        List<Field> fieldList = ClassUtils.getAllFields(getEntityType());
        Result<? extends Entity> entities = Repo.of(this.getEntityType()).find(generateQuery(query, fieldList));

        if (entityService != null) {
            fieldList.stream().filter(f -> f.getAnnotation(Materialization.class) != null).forEach(f -> {
                entityService.materializePropertyFromId((List<Entity>) entities.getRows(), f.getName(), f.getAnnotation(Materialization.class).entityField(), f.getAnnotation(Materialization.class).entityClass());
            });
        }


        return entities;
    }

    private boolean isNumber(Class c) {
        return c == int.class || c == long.class || c == double.class || c == float.class;
    }

    public Query generateQuery(Query query, List<Field> fieldList) {
        //adeguo tutti i filtri per i campi "boolean"

        fieldList.stream().filter(f -> f.getType().equals(boolean.class) || f.getType().equals(Boolean.class)).forEach(field -> {
            FilterUtils.addBooleanFilter(field.getName(), query);
        });

        fieldList.stream().filter(f -> isNumber(f.getType())).forEach(field -> {
            FilterUtils.addNumberFilter(field.getName(), query);
        });

        //Preparo la keyword query in base ai campi che ho annotato come "keyword" sul dominio
        if (StringUtils.hasLength(query.getKeyword())) {
            Disjunction disjunction = new Disjunction();

            disjunction.setChildren(fieldList.stream().filter(f -> f.getAnnotation(Search.class) != null && f.getAnnotation(Search.class).includeInKeyword()).map(f -> new Filter(f.getName(), query.getKeyword(), Filter.LIKE)).collect(Collectors.toList()));
            if (disjunction.getChildren().size() > 0) {
                query.getFilters().add(disjunction);

                //evito di accavallarmi ad eventuali logiche gestite nel repository
                query.setKeyword(null);
            }
        }

        //Todo gestisco le date in overlapp

        return query;
    }

}
