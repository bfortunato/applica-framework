package applica.framework.data.constraints;

import applica.framework.*;
import applica.framework.data.ConstraintException;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.velocity.runtime.Runtime;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Objects;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 30/10/14
 * Time: 11:33
 */
public abstract class UniqueConstraint<T extends Entity> implements Constraint<T> {

    /**
     * Returns a MongoQuery builder for check in check() function.
     * By default, entire entity collection was loaded.
     * You can specify an optimized query to load optimized data
     * @return
     */
    protected Query getOptimizedQuery(T entity) {
        try {
            return Query.build().eq(getProperty(), PropertyUtils.getProperty(entity, getProperty()));
        } catch (Exception e) {
            throw new RuntimeException("Field not found  or inaccessible in class: " + getProperty());
        }
    }


    @Override
    public void check(T entity) throws ConstraintException {
        Objects.requireNonNull(entity, "Entity cannot be null");
        Objects.requireNonNull(getProperty(), "Property cannot be null");
        Repository<T> repository = (Repository<T>) Repo.of(entity.getClass());
        Object value = null;
        try {
            value = PropertyUtils.getProperty(entity, getProperty());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        if (value != null) {
            for (Entity checkEntity : repository.find(getOptimizedQuery(entity)).getRows()) {
                if (!checkEntity.getId().equals(entity.getId())) {
                    Object checkValue = null;
                    try {
                        checkValue = PropertyUtils.getProperty(checkEntity, getProperty());
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }

                    if(value.equals(checkValue)) {
                        throw new ConstraintException(ConstraintException.Type.UNIQUE, getType(), getProperty());
                    }
                }
            }
        }
    }

}
