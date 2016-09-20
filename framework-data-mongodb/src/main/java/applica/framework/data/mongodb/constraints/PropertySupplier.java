package applica.framework.data.mongodb.constraints;

import applica.framework.Entity;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 30/10/14
 * Time: 12:48
 */

@FunctionalInterface
public interface PropertySupplier<T extends Entity, R> {

    /**
     * Gets property value from entity
     * @param entity
     * @return
     */
    R get(T entity);

}
