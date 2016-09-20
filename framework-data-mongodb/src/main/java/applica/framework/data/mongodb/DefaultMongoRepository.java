package applica.framework.data.mongodb;

import applica.framework.DefaultRepository;
import applica.framework.Entity;
import applica.framework.Repository;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 08/10/14
 * Time: 14:52
 */
public class DefaultMongoRepository<T extends Entity> extends MongoRepository<T> implements Repository<T>, DefaultRepository<T> {

    private Class<T> entityType;

    @Override
    public Class<T> getEntityType() {
        return entityType;
    }

    @Override
    public void setEntityType(Class<T> entityType) {
        this.entityType = entityType;
    }
}
