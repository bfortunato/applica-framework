package applica.framework.data.mongodb.constraints;

import applica.framework.Entity;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 30/10/14
 * Time: 11:30
 */
@Deprecated
public class ConstraintException extends applica.framework.data.ConstraintException {

    public ConstraintException(Type constraintType, Class<? extends Entity> entityType, String property) {
        super(constraintType, entityType, property);
    }

}
