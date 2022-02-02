package applica.framework.widgets.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Usato per materializzare determinate proprietà dell'oggetto in campi transient
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface Image {
    String nodeProperty();
    String size() default "";
    String directory();
 }