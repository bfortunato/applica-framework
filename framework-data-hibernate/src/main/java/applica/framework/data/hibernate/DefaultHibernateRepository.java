package applica.framework.data.hibernate;

import applica.framework.DefaultRepository;
import applica.framework.Entity;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 09/10/14
 * Time: 16:19
 */
public class DefaultHibernateRepository<T extends Entity> extends HibernateRepository<T> implements DefaultRepository<T> {

    private Class<T> entityType;

    @Override
    public void setEntityType(Class<T> type) {
        entityType = type;
    }

    @Override
    public Class<T> getEntityType() {
        return entityType;
    }

}
