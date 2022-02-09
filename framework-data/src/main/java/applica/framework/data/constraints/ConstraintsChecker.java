package applica.framework.data.constraints;

import applica.framework.EntitiesScanner;
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
    void checkDelete(Entity entity);

}
