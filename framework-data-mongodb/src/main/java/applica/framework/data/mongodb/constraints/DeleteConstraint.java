package applica.framework.data.mongodb.constraints;

import applica.framework.Entity;
import applica.framework.data.ConstraintException;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 30/10/14
 * Time: 11:29
 */
public interface DeleteConstraint<T extends Entity> {

    Class<T> getType();
    void check(T entity) throws ConstraintException;

}
