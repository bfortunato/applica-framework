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
    String entityField(); //field della classe corrente in cui verrà materializzata l'entità materializzata

    @Deprecated
    Class entityClass() default Object.class;



    String generateEntityId() default ""; //field che verrà usato come "id" per cercare le entity da materializzare


    /**
     * Restituisce il nome del metodo della classe in cui è presente il field che consente di determinare run time la classe dell'oggetto da materializzare.
     * La funzione in questione DEVE restituire un Class, essere public e non richiedere parametri
     * @return nome della funzione che e
     */
    String generateEntityClass() default "";

    /**
     * Se presente, restituisce il nome del metodo della classe che permette di determinare runtime se materializzare o meno quel campo
     * La funzione in questione DEVE restituire un boolean, essere public e non ricevere parametri
     * @return nome della funzione che e
     */
    String canBeMaterializedFunction() default "";

    //Se true in fase di saveOperation imposta il valore della property da materializzare in base a quella materializzata
    boolean reverseMaterialization() default false;

    boolean indexEnabled() default false;


 }
