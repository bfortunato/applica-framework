package applica.framework.data.mongodb;

import applica.framework.*;
import applica.framework.data.constraints.ConstraintsChecker;
import com.mongodb.BasicDBObject;
import com.mongodb.client.model.Filters;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Created by bimbobruno on 17/09/15.
 */

public class MongoCrudStrategy implements CrudStrategy {

    @Autowired
    private MongoMapper mongoMapper;

    @Autowired
    private MongoHelper mongoHelper;

    @Autowired(required = false)
    private ConstraintsChecker constraintsChecker;

    @Override
    public <T extends Entity> T get(Object id, Repository<T> repository) {
        T entity = null;

        MongoRepository<T> mongoRepository = (MongoRepository<T>) repository;
        Assert.notNull(mongoRepository, "Specified repository is not a mongo repository");

        if(id != null) {
            var relationsLoader = new RelationsLoader();
            Document document = mongoRepository.getCollection().find(MongoQuery.mk().id(String.valueOf(id))).first();
            if(document != null) {
                entity = (T) mongoMapper.loadObject(document, repository.getEntityType(), mongoRepository.getMappingContext(), relationsLoader);
            }
            relationsLoader.load();
        }

        return entity;
    }

    @Override
    public <T extends Entity> Result<T> find(applica.framework.Query loadRequest, Repository<T> repository) {
        MongoRepository<T> mongoRepository = (MongoRepository<T>) repository;
        Assert.notNull(mongoRepository, "Specified repository is not a mongo repository");

        Result<T> response = new Result<T>();
        List<T> entities = new ArrayList<>();

        Document query = mongoRepository.createQuery(loadRequest);
        Document projection = mongoRepository.createProjection(loadRequest);

        long count = mongoRepository.getCollection().countDocuments(query);
        int limit = loadRequest.getRowsPerPage();
        int skip = loadRequest.getRowsPerPage() * (loadRequest.getPage() - 1);

        var find = mongoRepository.getCollection().find(query).projection(projection);
        if (limit != 0) find.limit(limit);
        if (skip != 0) find.skip(skip);

        List<Sort> sorts = loadRequest.getSorts();
        if (sorts == null) {
            sorts = ((MongoRepository<T>) repository).getDefaultSorts();
        }

        if (sorts != null) {
            Document sortObject = new Document();
            for (Sort sort : sorts) {
                sortObject.append(sort.getProperty(), sort.isDescending() ? -1 : 1);
            }
            find.sort(sortObject);
        }

        var cursor = find.iterator();
        var relationsLoader = new RelationsLoader();

        while(cursor.hasNext()) {
            var document = cursor.next();

            T entity = (T) mongoMapper.loadObject(document, repository.getEntityType(), generateMappingConfigFromQuery(loadRequest), relationsLoader);
            entities.add(entity);
        }

        relationsLoader.load();

        response.setRows(entities);
        response.setTotalRows(count);

        return response;
    }

    @Override
    public <T extends Entity> long count(Query request, Repository<T> repository) {
        MongoRepository<T> mongoRepository = (MongoRepository<T>) repository;
        Assert.notNull(mongoRepository, "Specified repository is not a mongo repository");

        Document query = mongoRepository.createQuery(request);
        long count = mongoRepository.getCollection().countDocuments(query);

        return count;
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
            //constraintsChecker.checkForeign(entity);
        }

        Document document = mongoMapper.loadBasicDBObject(entity, null);
        if (document.containsKey("_id")) {
            var id = document.getObjectId("_id");
            mongoRepository.getCollection().replaceOne(Filters.eq("_id", id), document);
        } else {
            mongoRepository.getCollection().insertOne(document);
            entity.setId(document.getObjectId("_id").toString());
        }


    }

    @Override
    public <T extends Entity> void delete(Object id, Repository<T> repository) {
        MongoRepository<T> mongoRepository = (MongoRepository<T>) repository;
        Assert.notNull(mongoRepository, "Specified repository is not a mongo repository");

        mongoRepository.getCollection().find(Filters.eq("ciao", "ciao"));

        if(id != null) {
            if (constraintsChecker != null) {
                repository.get(id).ifPresent(entity -> {
                    constraintsChecker.checkPrimary(entity);
                    constraintsChecker.checkDelete(entity);
                });
            }

            mongoRepository.getCollection().deleteOne(MongoQuery.mk().id(String.valueOf(id)));
        }
    }

    @Override
    public <T extends Entity> void deleteMany(Query query, Repository<T> repository) {
        MongoRepository<T> mongoRepository = (MongoRepository<T>) repository;
        Assert.notNull(mongoRepository, "Specified repository is not a mongo repository");

        if(query != null && query.getFilters().size() > 0) {
            var collection = mongoHelper.getMongoCollection(mongoRepository);

            collection.deleteMany(mongoRepository.createQuery(query));
        }
    }

    @Override
    public <T extends Entity> Object sum(Query request, String field, Repository<T> repository) {
        MongoRepository<T> mongoRepository = (MongoRepository<T>) repository;
        BasicDBObject match = new BasicDBObject("$match", mongoRepository.createQuery(request));



        BasicDBObject group = new BasicDBObject("$group", (new BasicDBObject("_id", null)).append("sum", new BasicDBObject("$sum", String.format("$%s", field))));
        var collection = mongoHelper.getMongoCollection(mongoRepository);

        Object sum = 0D;
        try {
            Iterable output = collection.aggregate(Arrays.asList(match, group));
            if (output.iterator().hasNext()) {
                sum = ((Document) output.iterator().next()).get("sum", sum);
            }
        } catch (Exception e) {
            e.printStackTrace();

        }

        return sum;
    }


    @Override
    public <T extends Entity> Object avg(Query request, String field, Repository<T> repository) {
        MongoRepository<T> mongoRepository = (MongoRepository<T>) repository;
        BasicDBObject match = new BasicDBObject("$match", mongoRepository.createQuery(request));

        BasicDBObject group = new BasicDBObject("$group", (new BasicDBObject("_id", null)).append("avg", new BasicDBObject("$avg", String.format("$%s", field))));
        var collection = mongoHelper.getMongoCollection(mongoRepository);

        Object avg = 0D;
        try {
            Iterable output = collection.aggregate(Arrays.asList(match, group));
            if (output.iterator().hasNext()) {
                avg = ((Document) output.iterator().next()).get("avg", avg);
            }
        } catch (Exception e) {
            e.printStackTrace();

        }

        return avg;
    }

}
