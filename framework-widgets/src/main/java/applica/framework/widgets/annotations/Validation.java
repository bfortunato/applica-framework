package applica.framework.widgets.annotations;

import applica.framework.Entity;

import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
@Repeatable(Validations.class)
public @interface Validation {

    public static final String GT = "gt";
    public static final String GTE = "gte";
    public static final String LT = "lt";
    public static final String LTE = "lte";


    //Campo da rifiutare
    String rejectField() default "";

    boolean required() default false;
    //Nome della funzione che verrà usata per capire se innescare o meno il controllo required; richiede comunque che required sia true
    String validationFunction() default "";

    boolean unique() default false;
    //Se la classe sulla quale fare il controllo di univocità è diversa da quella della entità corrente
    Class<? extends Entity>[] uniqueClass() default {};
    //Query per generare una query in base alla quale fare il controllo univocità
    String uniqueQueryFunction() default "";

    //> 0
    boolean greaterThanZero() default false;

    //>= 0
    boolean positive() default false;

    String rejectMessage() default "";


    /*
    * ESEMPIO:
    @Validation(rangeOtherValue = "max", rangeOperator = Validation.LTE)
    private Double min;

    @Validation(rangeOtherValue = "min", rangeOperator = Validation.GTE)
    private Double max;
    * */
    String rangeOperator() default "";
    String rangeOtherValue() default "";


    int maxLength() default -1;

    boolean isOnlyOnTheFly() default false;

    //Se true ed il field di riferimento è un'altra entity applica la validzione anche ad esso; se il field è nullo il controllo non viene eseguito
    boolean validateSubObject() default false;

    //Se validateSubObject()  == true , la modalità di messaggi di errore semplificata restituisce una stringa del tipo Riga [Numero riga], [Nome campo]: [Errore di validazione];
    //IN caso contrario restituisce qualcosa del tipo rows[Numero Riga]_[nomecampo]: [Errore di valdiazione] (destinato ad uso descriptor nell'entity form)
    boolean subObjectSimplifiedErrorMessages() default false;

}
