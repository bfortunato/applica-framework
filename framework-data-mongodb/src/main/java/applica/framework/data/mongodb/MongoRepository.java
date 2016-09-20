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
	
	DBCollection collection;

    public void init() {
        if (collection == null) {
            DB db = mongoHelper.getDB(getDataSource());
            if (db != null) {
                collection = db.getCollection(getCollectionName());
            } else {
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

		if(collection == null) { 
			logger.warn("Mongo collection is null");
			return null;
		}

		T entity = crudStrategy.get(id, this);
		
		return Optional.ofNullable(entity);
	}

	@Override
	public LoadResponse find(LoadRequest loadRequest) {
        init();

		if(collection == null) { 
			logger.warn("Mongo collection is null");
			return null;
		}
		
		if(loadRequest == null) loadRequest = new LoadRequest();
		
		LoadResponse response = crudStrategy.find(loadRequest, this);
		
		return response;
	}

    public void pushFilter(Query query, Filter filter) {
        switch (filter.getType()) {
            case Filter.LIKE:
                query.like(filter.getProperty(), filter.getValue().toString());
                break;
            case Filter.GT:
                query.gt(filter.getProperty(), filter.getValue());
                break;
            case Filter.GTE:
                query.gte(filter.getProperty(), filter.getValue());
                break;
            case Filter.LT:
                query.lt(filter.getProperty(), filter.getValue());
                break;
            case Filter.LTE:
                query.lte(filter.getProperty(), filter.getValue());
                break;
            case Filter.EQ:
                query.eq(filter.getProperty(), filter.getValue());
                break;
            case Filter.RANGE:
                query.range(filter.getProperty(), (List)filter.getValue());
                break;
            case Filter.IN:
                query.in(filter.getProperty(), (List)filter.getValue());
                break;
            case Filter.NIN:
                query.nin(filter.getProperty(), (List)filter.getValue());
                break;
            case Filter.ID:
                if(filter.getProperty() == null) {
                    query.id((String)filter.getValue());
                } else {
                    query.id(filter.getProperty(), (String)filter.getValue());
                }
                break;
            case Filter.OR:
                List<Filter> ors = (List<Filter>) filter.getValue();
                query.or(ors.stream().map((f) -> {
                    Query q = query();
                    pushFilter(q, f);
                    return q;
                }).collect(Collectors.toList()));
                break;
            case Filter.AND:
                List<Filter> ands = (List<Filter>) filter.getValue();
                query.and(ands.stream().map((f) -> {
                    Query q = query();
                    pushFilter(q, f);
                    return q;
                }).collect(Collectors.toList()));
                break;
        }
    }

	public Query createQuery(LoadRequest loadRequest) {
		Query query = query();

        for (Filter filter : loadRequest.getFilters()) {
            if (filter.getValue() == null) {
                continue;
            }

            pushFilter(query, filter);
        }
        return query;
	}

	@Override
	public void delete(Object id) {
        init();

		if(collection == null) { 
			logger.warn("Mongo collection is null");
			return;
		}
		
		crudStrategy.delete(id, this);
	}

	@Override
	public void save(T entity) {
        init();

		if(collection == null) { 
			logger.warn("Mongo collection is null");
			return;
		}

        crudStrategy.save(entity, this);
	}

    public List<Sort> getDefaultSorts() {
		return null;
	}

    public Query query() {
        return Query.mk();
    }

    public String getDataSource() {
        return "default";
    }

    public DBCollection getCollection() {
        return collection;
    }
}
