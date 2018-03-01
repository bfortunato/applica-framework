package applica.framework.data.mongodb.constraints;

import applica.framework.Entity;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 30/10/14
 * Time: 11:30
 */
@Deprecated
public class ConstraintException extends RuntimeException {

    public enum Type {
        FOREIGN,
        UNIQUE
    }

    private Type constraintType;
    private Class<? extends Entity> entityType;
    private String property;

    public ConstraintException(Type constraintType, Class<? extends Entity> entityType, String property) {
        this.constraintType = constraintType;
        this.entityType = entityType;
        this.property = property;
    }

    public Type getConstraintType() {
        return constraintType;
    }

    public Class<? extends Entity> getEntityType() {
        return entityType;
    }

    public String getProperty() {
        return property;
    }
}
