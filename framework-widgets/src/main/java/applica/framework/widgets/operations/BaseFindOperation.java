package applica.framework.widgets.operations;

import applica.framework.*;
import applica.framework.data.Keyword;
import applica.framework.library.responses.Response;
import applica.framework.library.utils.ProgramException;
import applica.framework.library.utils.SystemOptionsUtils;
import applica.framework.library.utils.TypeUtils;
import applica.framework.security.EntityService;
import applica.framework.security.Security;
import applica.framework.security.authorization.AuthorizationException;
import applica.framework.security.utils.PermissionUtils;
import applica.framework.widgets.acl.CrudPermission;
import applica.framework.widgets.annotations.*;
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
import java.util.*;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.stream.Collectors;

import static applica.framework.builders.QueryExpressions.in;

public class BaseFindOperation implements FindOperation, ResultSerializerListener {

    @Autowired(required = false)
    private OperationsRouter router;

    public enum SourceType {
        LIST_OF_ENTITY,
        ENTITY,
        IDS,
        ID
    }

    public record JsonRelation(SourceType sourceType, ObjectNode destination, String destinationProperty, Object sourceValue, Repository<? extends Entity> repository) {}

    public class JsonRelationsLoader {
        private List<JsonRelation> relations;

        void addRelation(JsonRelation relation) {
            if (relations == null) {
                relations = new ArrayList<>();
            }
            relations.add(relation);
        }

        public List<JsonRelation> getRelations() {
            return relations;
        }

        public void load() {
            if (relations != null) {
                relations.stream().collect(Collectors.groupingBy(JsonRelation::repository)).forEach((repository, rs) -> {
                    var ids = new ArrayList<Object>();
                    rs.forEach(r -> {
                        switch (r.sourceType) {
                            case IDS -> ids.addAll((List<Object>)r.sourceValue);
                            case ID -> ids.add(r.sourceValue);
                        }
                    });

                    var rows = repository.find(in("id", ids)).getRows();
                    rs.forEach(r -> {
                        switch (r.sourceType) {
                            case IDS -> r.destination.putPOJO(r.destinationProperty, ((List<Object>)r.sourceValue).stream().map(id -> rows.stream().filter(row -> Objects.equals(row.getId(), id)).findFirst().orElseThrow()).toList());
                            case ID -> r.destination.putPOJO(r.destinationProperty, rows.stream().filter(row -> Objects.equals(row.getId(), r.sourceValue)).findFirst().orElseThrow());
                        }
                    });
                });
            }
        }
    }


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

    protected ObjectNode serialize(Result<? extends Entity> result, Query query, JsonRelationsLoader relationsLoader) throws OperationException {
        ResultSerializer serializer = new DefaultResultSerializer(getEntityType(), this);
        try {
            return serializer.serialize(result, query, relationsLoader);
        } catch (SerializationException e) {
            throw new OperationException(Response.ERROR_SERIALIZATION, e);
        }
    }

    @Override
    public ObjectNode serialize(Result<? extends Entity> result, Query query) throws OperationException {
        var relationLoader = new JsonRelationsLoader();
        var ret = serialize(result, query, relationLoader);
        relationLoader.load();
        return ret;
    }

    @Override
    public void onSerializeEntity(ObjectNode node, Entity entity, Object... params) {
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

        JsonRelationsLoader relationsLoader = ((JsonRelationsLoader) params[1]);
        if (relationsLoader == null) {
            throw new RuntimeException("relationsLoader not provided");
        }

        appendJsonMaterialization(fieldList, entity, node, relationsLoader);
    }

    protected void appendJsonMaterialization(List<Field> fields, Entity entity, ObjectNode node, JsonRelationsLoader relationsLoader) {
        try {
            for (var field : fields) {
                var jsonMaterialization = field.getAnnotation(JsonMaterialization.class);
                if (jsonMaterialization != null) {
                    if (Arrays.asList(jsonMaterialization.operations()).contains(Operations.FIND)) {
                        var sourceValue = field.get(entity);
                        if (sourceValue != null) {
                            if (TypeUtils.isListOfEntities(field.getGenericType())) {
                                map().entitiesToIds(entity, node, field.getName(), jsonMaterialization.destination());
                            } else if (TypeUtils.isEntity(field.getType())) {
                                map().entityToId(entity, node, field.getName(), jsonMaterialization.destination());
                            } else if (sourceValue instanceof List) {
                                relationsLoader.addRelation(new JsonRelation(SourceType.IDS, node, jsonMaterialization.destination(), sourceValue, Repo.of(jsonMaterialization.entityType())));
                                //map().idsToEntities(entity, node, field.getName(), jsonMaterialization.destination(), jsonMaterialization.entityType());
                            } else {
                                relationsLoader.addRelation(new JsonRelation(SourceType.ID, node, jsonMaterialization.destination(),  sourceValue, Repo.of(jsonMaterialization.entityType())));
                                //map().idToEntity(entity, node, jsonMaterialization.entityType(), field.getName(), jsonMaterialization.destination());
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
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
        List<Field> fieldList = generateFieldsForMaterialization();
        Result<? extends Entity> entities = findByQuery(generateQuery(query, fieldList));

        if (!(materializationDisabled.get() != null  && materializationDisabled.get())) {
           materialize(entities.getRows(), fieldList);
        }

        return entities;
    }

    public Result<? extends Entity> findByQuery(Query generateQuery) {
        Function<Query, Result<? extends Entity>> fn;
        if (router != null && (fn = router.getFetchListRoute(entityType).orElse(null)) != null) {
            return fn.apply(generateQuery);
        } else {
            return Repo.of(getEntityType()).find(generateQuery);
        }
    }

    public void materialize(List<? extends Entity> rows, List<Field> fieldList) {
        materializeFields(rows, entityService, fieldList);
    }



    public List<Field> generateFieldsForMaterialization() {
        return ClassUtils.getAllFields(getEntityType());
    }


    public static void materializeFields(List<? extends Entity> rows) {
        materializeFields(rows, ApplicationContextProvider.provide().getBean(EntityService.class), null);
    }

    public static void materializeFields(List<? extends Entity> rows, EntityService entityService, List<Field> fieldList) {
        if (rows == null || rows.size() == 0)
            return;
        fieldList = fieldList == null && rows != null && rows.size() > 0 ? ClassUtils.getAllFields(rows.get(0).getClass()): fieldList;
        if (entityService != null && fieldList != null) {
            fieldList.stream().filter(f -> f.getAnnotation(Materialization.class) != null).forEach(f -> {
                entityService.materializePropertyFromId(rows, f.getName());
            });
        }
    }

    private boolean isNumber(Class c) {
        return c == int.class || c == long.class || c == double.class || c == float.class || c == Integer.class || c == Double.class || c == Float.class || c == Long.class;
    }


    public Query generateQuery(Query query, List<Field> fieldList) {
        //adeguo tutti i filtri per i campi "boolean"

        fieldList.stream().filter(f -> f.getType().equals(boolean.class) || f.getType().equals(Boolean.class)).forEach(field -> {
            FilterUtils.addBooleanFilter(field.getName(), query);
        });

        fieldList.stream().filter(f -> isNumber(f.getType())).forEach(field -> {
            FilterUtils.addNumberFilter(field.getName(), (Class<? extends Number>) field.getType(), query);
        });

        //Preparo la keyword query in base ai campi che ho annotato come "keyword" sul dominio
        if (StringUtils.hasLength(query.getKeyword())) {
            Disjunction disjunction = new Disjunction();

            disjunction.setChildren(fieldList.stream().filter(f -> (f.getAnnotation(Search.class) != null && f.getAnnotation(Search.class).includeInKeyword()) || f.getAnnotation(Keyword.class) != null).map(f -> new Filter(f.getName(), query.getKeyword(), Filter.LIKE)).collect(Collectors.toList()));

            manageKeywordDisjunction(query, disjunction);

            if (disjunction.getChildren().size() > 0) {
                query.getFilters().add(disjunction);

                //evito di accavallarmi ad ewventuali logiche gestite nel repository
                query.setKeyword(null);
            }
        }

        //Todo gestisco le date in overlapp

        return query;
    }

    public void manageKeywordDisjunction(Query q, Disjunction disjunction) {

    }

}
