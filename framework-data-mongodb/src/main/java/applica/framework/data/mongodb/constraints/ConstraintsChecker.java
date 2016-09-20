package applica.framework.data.mongodb.constraints;

import applica.framework.Entity;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 30/10/14
 * Time: 11:41
 */
public interface ConstraintsChecker {

    void check(Entity entity);
    void checkPrimary(Entity entity);
    void checkForeign(Entity entity);

}
