package applica.framework.data.constraints;

import applica.framework.Entity;
import applica.framework.data.ConstraintException;

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
    void check(T1 primaryEntity) throws ConstraintException;

}
