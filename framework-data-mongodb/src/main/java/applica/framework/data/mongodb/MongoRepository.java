package applica.framework.data.mongodb;

import applica.framework.*;
import applica.framework.builders.Statement;
import applica.framework.data.KeywordQueryBuilder;
import applica.framework.library.utils.Strings;
import applica.framework.library.utils.SystemOptionsUtils;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Sorts;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.bson.BsonDocument;
import org.bson.BsonString;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public abstract class MongoRepository<T extends Entity> implements Repository<T>, DisposableBean {

    @Autowired
    private MongoHelper mongoHelper;

    @Autowired
    private CrudStrategy crudStrategy;

    private Log logger = LogFactory.getLog(getClass());

    private MongoDatabase db;
    private MappingContext mappingContext;

    private boolean repositoryLogEnabled;

    public void init() {
        if (db == null) {
            db = mongoHelper.getDatabase(getDataSource());
            if (db == null) {
                logger.warn("Mongo DB is null");
            }
        }

        repositoryLogEnabled = SystemOptionsUtils.isEnabled("log.repository");
    }


    @Override
    public void destroy() {
        mongoHelper.close(getDataSource());
    }

    public String getCollectionName() {
        return Strings.pluralize(StringUtils.uncapitalize(getEntityType().getSimpleName()));
    }

    @Override
    public Optional<T> get(Object id) {
        init();

        if(db == null) {
            logger.warn("Mongo DB is null");
            return null;
        }

        T entity = crudStrategy.get(id, this);

        if (repositoryLogEnabled) {
            logger.info(String.format("REPOSITORY - GET - ID: %s - ENTITY: %s", id, entity));
        }

        return Optional.ofNullable(entity);
    }

    public Optional<T> get(Object id, MappingContext mappingContext) {
        init();

        if(db == null) {
            logger.warn("Mongo DB is null");
            return null;
        }

        this.mappingContext = mappingContext;
        T entity = crudStrategy.get(id, this);
        this.mappingContext = null;

        if (repositoryLogEnabled) {
            logger.info(String.format("REPOSITORY - GET - ID: %s - ENTITY: %s", id, entity));
        }

        return Optional.ofNullable(entity);
    }

    @Override
    public Result find(Query query) {
        init();

        if(db == null) {
            logger.warn("Mongo DB is null");
            return null;
        }

        if(query == null) query = new Query();

        if (org.apache.commons.lang3.StringUtils.isNotEmpty(query.getKeyword())) {
            query = this.keywordQuery(query);
        }

        Result response = crudStrategy.find(query, this);

        if (repositoryLogEnabled) {
            logger.info(String.format("REPOSITORY - FIND - QUERY: %s", query.toString()));
        }

        return response;
    }

    @Override
    public Statement<T> find(Filter... filters) {
        return new Statement<>(this, filters);
    }

    public void pushFilter(MongoQuery mongoQuery, Filter filter) {
        switch (filter.getType()) {
            case Filter.LIKE:
                String value = filter.getValue() != null ? generateRegexFilterValue(filter.getValue().toString()) : null;
                mongoQuery.like(filter.getProperty(), value);
                break;
            case Filter.GT:
                mongoQuery.gt(filter.getProperty(), filter.getValue());
                break;
            case Filter.GTE:
                mongoQuery.gte(filter.getProperty(), filter.getValue());
                break;
            case Filter.LT:
                mongoQuery.lt(filter.getProperty(), filter.getValue());
                break;
            case Filter.LTE:
                mongoQuery.lte(filter.getProperty(), filter.getValue());
                break;
            case Filter.EQ:
                mongoQuery.eq(filter.getProperty(), filter.getValue());
                break;
            case Filter.REGEX:
                mongoQuery.regex(filter.getProperty(), filter.getValue());
                break;
            case Filter.NE:
                mongoQuery.ne(filter.getProperty(), filter.getValue());
                break;
            case Filter.RANGE:
                mongoQuery.range(filter.getProperty(), (List)filter.getValue());
                break;
            case Filter.EXISTS:
                mongoQuery.exists(filter.getProperty(), (Boolean) filter.getValue());
                break;
            case Filter.IN:
                mongoQuery.in(filter.getProperty(), (List)filter.getValue());
                break;
            case Filter.NIN:
                mongoQuery.nin(filter.getProperty(), (List)filter.getValue());
                break;
            case Filter.ID:
                if(filter.getProperty() == null) {
                    mongoQuery.id((String)filter.getValue());
                } else {
                    mongoQuery.id(filter.getProperty(), (String)filter.getValue());
                }
                break;
            case Filter.OR:
                List<Filter> ors = (List<Filter>) filter.getValue();
                List<MongoQuery> allOrs = mongoQuery.get("$and") != null? (List<MongoQuery>) mongoQuery.get("$and") : new ArrayList<>();
                allOrs.add(generateMongoQueryWithOr(ors));
                mongoQuery.and(allOrs);
                break;
            case Filter.GEO_WHITHIN:
                mongoQuery.geo(filter.getProperty(), (GeoFilter) filter.getValue());
                break;
            case Filter.TEXT:
                mongoQuery.put("$text", new Document("$search", filter.getValue()));

                break;
            case Filter.AND:
                List<Filter> ands = (List<Filter>) filter.getValue();

                List<MongoQuery> allAnds = mongoQuery.get("$and") != null? (List<MongoQuery>) mongoQuery.get("$and") : new ArrayList<>();

                allAnds.addAll(ands.stream().map((f) -> {
                    MongoQuery q = query();
                    pushFilter(q, f);
                    return q;
                }).collect(Collectors.toList()));

                mongoQuery.and(allAnds);
                break;
            case Filter.ELEM_MATCH:
                // Supponiamo che filter.getValue() sia una lista di altri filtri che devono essere applicati con elemMatch
                List<Filter> elemMatchFilters = (List<Filter>) filter.getValue();

                MongoQuery elemMatchQuery = query();
                for (Filter subFilter : elemMatchFilters) {
                    pushFilter(elemMatchQuery, subFilter);
                }

                mongoQuery.elemMatch(filter.getProperty(), elemMatchQuery);
                break;

        }
    }

    private String generateRegexFilterValue(String toString) {
        Pattern p = Pattern.compile("[\\.\\*\\+\\?\\^\\${}\\(\\)|\\]\\[\\\\]");
        Matcher m = p.matcher(toString);
        return m.replaceAll("\\\\$0");
    }

    public MongoQuery createQuery(Query loadRequest) {
        MongoQuery mongoQuery = query();

        for (Filter filter : loadRequest.getFilters()) {
            pushFilter(mongoQuery, filter);
        }
        return mongoQuery;
    }


    @Override
    public void deleteMany(Query request) {
        init();

        if(db == null) {
            logger.warn("Mongo DB is null");
            return;
        }
        crudStrategy.deleteMany(request, this);

        if (repositoryLogEnabled) {
            logger.info(String.format("REPOSITORY - DELETE MANY - QUERY: %s", request.toString()));
        }
    }

    @Override
    public Object sum(Query request, String field) {
        init();

        if(db == null) {
            logger.warn("Mongo DB is null");
            return null;
        }
        if (repositoryLogEnabled) {
            logger.info(String.format("REPOSITORY - SUM - QUERY: %s, FIELD: %s", request.toString(), field));
        }

        return crudStrategy.sum(request, field, this);
    }

    @Override
    public Object avg(Query request, String field) {
        init();

        if(db == null) {
            logger.warn("Mongo DB is null");
            return null;
        }

        if (repositoryLogEnabled) {
            logger.info(String.format("REPOSITORY - AVERAGE - QUERY: %s, FIELD: %s", request.toString(), field));
        }

        return crudStrategy.avg(request, field, this);
    }

    @Override
    public void delete(Object id) {
        init();

        if(db == null) {
            logger.warn("Mongo DB is null");
            return;
        }

        if (repositoryLogEnabled) {
            logger.info(String.format("REPOSITORY - DELETE - ID: %s", id));
        }

        crudStrategy.delete(id, this);
    }

    @Override
    public void save(T entity) {
        boolean create = entity.getId() == null;

        init();

        if(db == null) {
            logger.warn("Mongo DB is null");
            return;
        }

        crudStrategy.save(entity, this);

        if (repositoryLogEnabled) {
            logger.info(String.format("REPOSITORY - %s - ID: %s ENTITY: %s", create? "CREATE" : "SAVE", entity.getId(), entity.toString()));
        }
    }

    @Override
    public void saveAll(List<T> entity) {

        init();

        if(db == null) {
            logger.warn("Mongo DB is null");
            return;
        }

        crudStrategy.saveAll(entity, this);
    }

    public List<Sort> getDefaultSorts() {
        return null;
    }

    public MongoQuery query() {
        return MongoQuery.mk();
    }

    public String getDataSource() {
        return "default";
    }

    public MongoCollection<Document> getCollection() {
        return db.getCollection(getCollectionName());
    }

    public MongoCollection<Document> get() {
        return db.getCollection(getCollectionName());
    }

    @Override
    public Query keywordQuery(Query query) {
        new KeywordQueryBuilder(getEntityType()).build(query);

        return query;
    }

    public Document createProjection(Query loadRequest) {
        Document proj = null;
        if (loadRequest.getProjections() != null && (loadRequest.getProjections().size() > 0)) {

            proj = new Document();

            for (Projection projection : loadRequest.getProjections()) {
                proj.put(projection.getProperty(), projection.isVisible());
            }
        }


        if (loadRequest.getFilters().stream().anyMatch(f -> Objects.equals(f.getType(), Filter.TEXT))) {
            if (proj == null)
                proj = new Document();
            proj.put("score", new BsonDocument("$meta", new BsonString("textScore")));
        }

        return proj;
    }

    private MongoQuery generateMongoQueryWithOr(List<Filter> ors) {
        MongoQuery query = new MongoQuery();
        query.or(ors.stream().map((f) -> {
            MongoQuery q = query();
            pushFilter(q, f);
            return q;
        }).collect(Collectors.toList()));
        return query;
    }

    public MappingContext getMappingContext() {
        return mappingContext;
    }

    @Override
    public List<T> getMultiple(List<Object> ids) {
        init();

        if(db == null) {
            logger.warn("Mongo DB is null");
            return null;
        }

        ids = new ArrayList<>(ids);
        ids.removeIf(id ->  id == null || !org.springframework.util.StringUtils.hasLength(id.toString()));

        if (ids.size() == 0)
            return new ArrayList<>();

        Query query = Query.build();
        query.getFilters().add(new Filter("_id",  ids.stream().map(id -> new ObjectId(id.toString())).collect(Collectors.toList()), Filter.IN));


        Result response = crudStrategy.find(query, this);

        if (repositoryLogEnabled) {
            logger.info(String.format("REPOSITORY - GET MULTIPLE - ID: %s", ids.stream().map(Object::toString).collect(Collectors.joining(", "))));
        }

        return response.getRows();
    }
}
