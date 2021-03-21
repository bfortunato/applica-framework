package applica.framework.widgets.annotations;

import applica.framework.Entity;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface Validation {

    public static final String RANGE_MIN = "MIN_VALUE";
    public static final String RANGE_MAX = "MAX_VALUE";

    public static final String GT = "gt";
    public static final String GTE = "gte";
    public static final String LT = "lt";
    public static final String LTE = "lte";


    //Campo da rifiutare
    String rejectField() default "";
    boolean required() default false;

    boolean unique() default false;
    //Se la classe sulla quale fare il controllo di univocità è diversa da quella della entità corrente
    Class<? extends Entity>[] uniqueClass() default {};

    //> 0
    boolean greaterThanZero() default false;

    //>= 0
    boolean positive() default false;

    String rejectMessage() default "";


    /*
    * ESEMPIO:
    @Validation(rangeType = Validation.RANGE_MIN, rangeOtherValue = "max", rangeOperator = Validation.LTE)
    private Double min;

    @Validation(rangeType = Validation.RANGE_MAX, rangeOtherValue = "min", rangeOperator = Validation.GTE)
    private Double max;
    * */
    String rangeType() default "";
    String rangeOperator() default "";
    String rangeOtherValue() default "";


    //Nome della funzione che verrà usata per capire se innescare o meno il controllo di validità
    String validationFunction() default "";

}
