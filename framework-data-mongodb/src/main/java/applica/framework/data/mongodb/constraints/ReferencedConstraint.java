package applica.framework.data.mongodb.constraints;

import applica.framework.Entity;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 30/10/14
 * Time: 16:55
 */
public interface ReferencedConstraint<T1 extends Entity, T2 extends Entity> {

    Class<T1> getPrimaryType();
    //String getPrimaryProperty();
    Class<T2> getForeignType();
    String getForeignProperty();
    void checkPrimary(T1 entity) throws ConstraintException;
    void checkForeign(T2 foreignEntity) throws ConstraintException;

}
