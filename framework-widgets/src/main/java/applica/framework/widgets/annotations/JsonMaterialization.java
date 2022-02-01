package applica.framework.widgets.annotations;

import applica.framework.Entity;
import applica.framework.widgets.operations.Operations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.Locale;

/**
 * Usato per materializzare determinate proprietà dell'oggetto nel json risultante nelle operazioni (shortcut del mapping)
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface JsonMaterialization {

    /**
     * Il campo di destinazione dell'entità o dell'id, proveniente dall'entita caricata dalla get o dalla save
     * @return
     */
    String destination();


    /**
     * Il tipo di entità da materializzare
     * @return
     */
    Class<? extends Entity> entityType();

    /**
     * Lista delle operazioni in cui interviene la materializzazione json
     * @return
     */
    String[] operations() default {
        Operations.GET,
        Operations.FIND,
        Operations.SAVE,
        Operations.DELETE
    };

    //Se true in fase di saveOperation imposta il valore della property da materializzare in base a quella materializzata
    boolean reverse() default false;

 }
