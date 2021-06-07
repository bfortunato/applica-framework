package applica.framework.data.mongodb;

import applica.framework.*;
import applica.framework.data.mongodb.constraints.ConstraintsChecker;
import com.mongodb.BasicDBObject;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by bimbobruno on 17/09/15.
 */

public class MongoCrudStrategy implements CrudStrategy {

    @Autowired
    private MongoMapper mongoMapper;

    @Autowired(required = false)
    private ConstraintsChecker constraintsChecker;

    @Override
    public <T extends Entity> T get(Object id, Repository<T> repository) {
        T entity = null;

        MongoRepository<T> mongoRepository = (MongoRepository<T>) repository;
        Assert.notNull(mongoRepository, "Specified repository is not a mongo repository");

        if(id != null) {
            BasicDBObject document = (BasicDBObject) mongoRepository.getCollection().findOne(MongoQuery.mk().id(String.valueOf(id)));
            if(document != null) {
                entity = (T) mongoMapper.loadObject(document, repository.getEntityType(), mongoRepository.getMappingContext());
            }
        }

        return entity;
    }

    @Override
    public <T extends Entity> Result<T> find(applica.framework.Query loadRequest, Repository<T> repository) {
        MongoRepository<T> mongoRepository = (MongoRepository<T>) repository;
        Assert.notNull(mongoRepository, "Specified repository is not a mongo repository");

        Result<T> response = new Result<T>();
        List<T> entities = new ArrayList<>();

        DBObject query = mongoRepository.createQuery(loadRequest);
        DBObject projection = mongoRepository.createProjection(loadRequest);
        long count = mongoRepository.getCollection().count(query);
        int limit = loadRequest.getRowsPerPage();
        int skip = loadRequest.getRowsPerPage() * (loadRequest.getPage() - 1);

        DBCursor cur = mongoRepository.getCollection().find(query, projection);
        if (limit != 0) cur.limit(limit);
        if (skip != 0) cur.skip(skip);

        List<Sort> sorts = loadRequest.getSorts();
        if (sorts == null) {
            sorts = ((MongoRepository<T>) repository).getDefaultSorts();
        }


        if (sorts != null) {
            BasicDBObject sortObject = new BasicDBObject();
            for (Sort sort : sorts) {
                sortObject.append(sort.getProperty(), sort.isDescending() ? -1 : 1);
            }
            cur.sort(sortObject);
        }

        while(cur.hasNext()) {
            BasicDBObject document = (BasicDBObject)cur.next();

            T entity = (T) mongoMapper.loadObject(document, repository.getEntityType(), generateMappingConfigFromQuery(loadRequest));
            entities.add(entity);
        }

        response.setRows(entities);
        response.setTotalRows(count);

        return response;
    }

    private MappingContext generateMappingConfigFromQuery(Query loadRequest) {
        MappingContext config = new MappingContext();
        config.setAlwaysIgnoreNestedReferences(loadRequest.isIgnoreNestedReferences());
        return config;
    }

    @Override
    public <T extends Entity> void save(T entity, Repository<T> repository) {
        MongoRepository<T> mongoRepository = (MongoRepository<T>) repository;
        Assert.notNull(mongoRepository, "Specified repository is not a mongo repository");

        if (constraintsChecker != null) {
            constraintsChecker.check(entity);
            constraintsChecker.checkForeign(entity);
        }

        BasicDBObject document = mongoMapper.loadBasicDBObject(entity, null);
        mongoRepository.getCollection().save(document);

        entity.setId(document.getString("_id"));
    }

    @Override
    public <T extends Entity> void delete(Object id, Repository<T> repository) {
        MongoRepository<T> mongoRepository = (MongoRepository<T>) repository;
        Assert.notNull(mongoRepository, "Specified repository is not a mongo repository");

        if(id != null) {
            if (constraintsChecker != null) {
                repository.get(id).ifPresent(entity -> {
                    constraintsChecker.checkPrimary(entity);
                    constraintsChecker.checkDelete(entity);
                });
            }

            mongoRepository.getCollection().remove(MongoQuery.mk().id(String.valueOf(id)));
        }
    }

}
