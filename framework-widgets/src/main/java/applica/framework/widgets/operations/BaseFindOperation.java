package applica.framework.widgets.operations;

import applica.framework.*;
import applica.framework.data.Keyword;
import applica.framework.library.responses.Response;
import applica.framework.library.utils.ProgramException;
import applica.framework.library.utils.SystemOptionsUtils;
import applica.framework.security.EntityService;
import applica.framework.security.Security;
import applica.framework.security.authorization.AuthorizationException;
import applica.framework.security.utils.PermissionUtils;
import applica.framework.widgets.acl.CrudPermission;
import applica.framework.widgets.annotations.File;
import applica.framework.widgets.annotations.Image;
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
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class BaseFindOperation implements FindOperation, ResultSerializerListener {
    private ThreadLocal<Boolean> materializationDisabled = new ThreadLocal<>();

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
    public void disableAutomaticMaterialization() {
        materializationDisabled.set(true);
    }

    @Override
    public void enableAutomaticMaterialization() {
        materializationDisabled.set(false);
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
        ObjectNode node = serialize(result, query);

        return node;
    }

    public void authorize(Query query) throws AuthorizationException {
        if (SystemOptionsUtils.isEnabled("crud.authorization.enabled")) {
            PermissionUtils.authorize(Security.withMe().getLoggedUser(), "entity", CrudPermission.LIST, getEntityType(), query);
        }
    }

    @Override
    public ObjectNode serialize(Result<? extends Entity> result, Query query) throws OperationException {
        ResultSerializer serializer = new DefaultResultSerializer(getEntityType(), this);
        try {
            return serializer.serialize(result, query);
        } catch (SerializationException e) {
            throw new OperationException(Response.ERROR_SERIALIZATION, e);
        }
    }

    @Override
    public void onSerializeEntity(ObjectNode node, Entity entity, Object ... params) {
        List<Field> fieldList = ClassUtils.getAllFields(getEntityType());

        if (isImageMaterializationEnabled()) {
            fieldList.stream().filter(f -> f.getAnnotation(Image.class) != null).forEach(f -> {
                EntityMapper mapper = ApplicationContextProvider.provide().getBean(EntityMapper.class);
                mapper.imageToDataUrl(entity, node, f.getName(), f.getAnnotation(Image.class).nodeProperty(), f.getAnnotation(Image.class).size());
            });
        }

        if (isFileMaterializationEnabled()) {
            fieldList.stream().filter(f -> f.getAnnotation(File.class) != null).forEach(f -> {
                EntityMapper mapper = ApplicationContextProvider.provide().getBean(EntityMapper.class);
                mapper.fileToDataUrl(entity, node, f.getName(), f.getAnnotation(File.class).nodeProperty());
            });
        }
    }

    public boolean isFileMaterializationEnabled() {
        return true;
    }

    public boolean isImageMaterializationEnabled() {
        return true;
    }

    protected EntityMapper map() {
        Objects.requireNonNull(entityMapper, "EntityMapper is null. Did you add a bean in application context configuration?");

        return entityMapper;
    }

    @Override
    public Result<? extends Entity> fetch(Query query) throws OperationException {
        Result<? extends Entity> entities = findByQuery(generateQuery(query));

        if (!(materializationDisabled.get() != null  && materializationDisabled.get())) {
           materialize(entities.getRows(), query);
        }

        return entities;
    }

    public Result<? extends Entity> findByQuery(Query generateQuery) {
        return Repo.of(this.getEntityType()).find(generateQuery);
    }


    public void materialize(List<? extends Entity> rows, Query query) {
        materializeFields(rows);
    }

    public List<Field> generateFieldsForMaterialization() {
        return ClassUtils.getAllFields(getEntityType());
    }

    public static void materializePropertyId(List<? extends Entity> e, String propertyId) {
        EntityService entityService = ApplicationContextProvider.provide().getBean(EntityService.class);
        entityService.materializePropertyFromId(e, propertyId);
    }


    public static void materializeFields(List<? extends Entity> rows) {
        if (rows == null || rows.size() == 0)
            return;

        EntityService entityService = ApplicationContextProvider.provide().getBean(EntityService.class);

        //grazie a questo groupBy rendo la materializzazione attiva anche su liste di oggetti non omogenei ed eseguo la materializzazione sulle sottoliste di oggetti omogenei
        rows.stream().collect(Collectors.groupingBy(i -> i.getClass())).forEach((entityClass, list) -> {
            List<Field> fields = ClassUtils.getAllFields(list.get(0).getClass());
            if (entityService != null) {
                fields.stream().filter(f -> f.getAnnotation(Materialization.class) != null).forEach(f -> {
                    entityService.materializePropertyFromId(list, f.getName());
                });
            }
        });


    }

    private boolean isNumber(Class c) {
        return c == int.class || c == long.class || c == double.class || c == float.class || c == Integer.class || c == Double.class || c == Float.class || c == Long.class;
    }


    public Query generateQuery(Query query) throws OperationException {
        //adeguo tutti i filtri per i campi "boolean"

        List<Field> fieldList = generateFieldsForMaterialization();;

        fieldList.stream().filter(f -> f.getType().equals(boolean.class) || f.getType().equals(Boolean.class)).forEach(field -> {
            FilterUtils.addBooleanFilter(field.getName(), query);
        });

        fieldList.stream().filter(f -> isNumber(f.getType())).forEach(field -> {
            FilterUtils.addNumberFilter(field.getName(), (Class<? extends Number>) field.getType(), query);
        });

        //Preparo la keyword query in base ai campi che ho annotato come "keyword" sul dominio
        if (StringUtils.hasLength(query.getKeyword())) {
            Disjunction disjunction = new Disjunction();

            if (query.getKeyword().trim().length() > 1)
                query.setKeyword(query.getKeyword().trim());

            disjunction.setChildren(fieldList.stream().filter(f -> (f.getAnnotation(Search.class) != null && f.getAnnotation(Search.class).includeInKeyword()) || f.getAnnotation(Keyword.class) != null).map(f -> new Filter(f.getName(), query.getKeyword(), Filter.LIKE)).collect(Collectors.toList()));

            manageKeywordDisjunction(query, disjunction);

            if (disjunction.getChildren().size() > 0) {
                query.getFilters().add(disjunction);

                //evito di accavallarmi ad ewventuali logiche gestite nel repository
                query.setKeyword(null);
            }
        }

        fieldList.stream().filter(f -> f.getAnnotation(Search.class) != null).forEach(field -> {
            Search searchAnnotation = field.getAnnotation(Search.class);
            if (searchAnnotation.equalIgnoreCase() || searchAnnotation.equalIgnoreCaseWithLike())
                FilterUtils.manageEqualIgnoreCaseFilter(query, field.getName(), searchAnnotation.equalIgnoreCaseWithLike());
        });

        //Todo gestisco le date in overlapp

        return query;
    }

    public void manageKeywordDisjunction(Query q, Disjunction disjunction) {

    }

}
