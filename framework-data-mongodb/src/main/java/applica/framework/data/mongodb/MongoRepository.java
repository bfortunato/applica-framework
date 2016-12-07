package applica.framework.data.mongodb;

import applica.framework.*;
import applica.framework.library.utils.Strings;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

import javax.annotation.PreDestroy;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public abstract class MongoRepository<T extends Entity> implements Repository<T> {
	
	@Autowired
	private MongoHelper mongoHelper;

    @Autowired
    private CrudStrategy crudStrategy;
	
	private Log logger = LogFactory.getLog(getClass());

    private DB db;

    public void init() {
        if (db == null) {
            db = mongoHelper.getDB(getDataSource());
            if (db == null) {
                logger.warn("Mongo DB is null");
            }
        }
	}
	
	@PreDestroy
	protected void destroy() {
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
		
		return Optional.ofNullable(entity);
	}

	@Override
	public Result find(applica.framework.Query query) {
        init();

        if(db == null) {
            logger.warn("Mongo DB is null");
            return null;
        }
		
		if(query == null) query = new applica.framework.Query();
		
		Result response = crudStrategy.find(query, this);
		
		return response;
	}

    public void pushFilter(MongoQuery mongoQuery, Filter filter) {
        switch (filter.getType()) {
            case Filter.LIKE:
                mongoQuery.like(filter.getProperty(), filter.getValue().toString());
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
            case Filter.RANGE:
                mongoQuery.range(filter.getProperty(), (List)filter.getValue());
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
                mongoQuery.or(ors.stream().map((f) -> {
                    MongoQuery q = query();
                    pushFilter(q, f);
                    return q;
                }).collect(Collectors.toList()));
                break;
            case Filter.AND:
                List<Filter> ands = (List<Filter>) filter.getValue();
                mongoQuery.and(ands.stream().map((f) -> {
                    MongoQuery q = query();
                    pushFilter(q, f);
                    return q;
                }).collect(Collectors.toList()));
                break;
        }
    }

	public MongoQuery createQuery(applica.framework.Query loadRequest) {
		MongoQuery mongoQuery = query();

        for (Filter filter : loadRequest.getFilters()) {
            if (filter.getValue() == null) {
                continue;
            }

            pushFilter(mongoQuery, filter);
        }
        return mongoQuery;
	}

	@Override
	public void delete(Object id) {
        init();

        if(db == null) {
            logger.warn("Mongo DB is null");
            return;
        }
		
		crudStrategy.delete(id, this);
	}

	@Override
	public void save(T entity) {
        init();

        if(db == null) {
            logger.warn("Mongo DB is null");
            return;
        }

        crudStrategy.save(entity, this);
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

    public DBCollection getCollection() {
        return db.getCollection(getCollectionName());
    }

    @Override
    public void addKeywordFilter(applica.framework.Query query, String keyword) {

    }
}
