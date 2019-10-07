package applica.framework.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 09/10/14
 * Time: 16:42
 */

/**
 * This annotation applied to an entity's list property allow framework to understand that is not a manyToMany instead of oneToMany
 * By default, a list is oneToMany.
 * In mongodb driver the list is in the object graph but in the db is stored with a list of ids
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface OneToMany {
}
