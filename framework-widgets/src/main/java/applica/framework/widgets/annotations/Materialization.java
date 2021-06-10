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
public @interface Materialization {
    String entityField();

    @Deprecated
    Class entityClass() default Object.class;

    //TODO: generare l'entityClass tramite un metodo (vedi l'utilizzo della validationFunction nella classe @Validation)
    String generateEntityClass() default "";

    //Se true in fase di saveOperation imposta il valore della property da materializzare in base a quella materializzata
    boolean reverseMaterialization() default false;

    boolean indexEnabled() default false;


 }