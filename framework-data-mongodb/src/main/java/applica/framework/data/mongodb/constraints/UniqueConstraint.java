package applica.framework.data.mongodb.constraints;

import applica.framework.Entity;
import applica.framework.LoadRequest;
import applica.framework.RepositoriesFactory;
import applica.framework.Repository;
import org.apache.commons.beanutils.PropertyUtils;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Objects;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 30/10/14
 * Time: 11:33
 */
public abstract class UniqueConstraint<T extends Entity> implements Constraint<T> {

    @Autowired
    private RepositoriesFactory repositoriesFactory;

    /**
     * Returns a LoadRequest builder for check in check() function.
     * By default, entire entity collection was loaded.
     * You can specify an optimized query to load optimized data
     * @return
     */
    protected LoadRequest getOptimizedLoadRequest(T entity) {
        return LoadRequest.build();
    }

    public RepositoriesFactory getRepositoriesFactory() {
        return repositoriesFactory;
    }

    public void setRepositoriesFactory(RepositoriesFactory repositoriesFactory) {
        this.repositoriesFactory = repositoriesFactory;
    }

    @Override
    public void check(T entity) throws ConstraintException {
        Objects.requireNonNull(entity, "Entity cannot be null");
        Objects.requireNonNull(getProperty(), "Property cannot be null");
        Repository<T> repository = repositoriesFactory.createForEntity(entity.getClass());
        Object value = null;
        try {
            value = PropertyUtils.getProperty(entity, getProperty());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        if (value != null) {
            for (Entity checkEntity : repository.find(getOptimizedLoadRequest(entity)).getRows()) {
                if (!checkEntity.getId().equals(entity.getId())) {
                    Object checkValue = null;
                    try {
                        checkValue = PropertyUtils.getProperty(checkEntity, getProperty());
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }

                    if(value.equals(checkValue)) {
                        throw new ConstraintException(String.format("%s.%s is not unique", getType().getName(), getProperty()));
                    }
                }
            }
        }
    }

}
