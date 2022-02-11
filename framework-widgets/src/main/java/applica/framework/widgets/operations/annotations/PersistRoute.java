package applica.framework.widgets.operations.annotations;

import applica.framework.Entity;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface PersistRoute {

    Class<? extends Entity> entityType();

}
