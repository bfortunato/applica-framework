package applica.framework.widgets.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface Search {
    boolean includeInKeyword() default false;

    //Include, in caso di query con EQ, la condizione di uguaglianza anche con l'upperCase/lowercase
    boolean equalIgnoreCase() default false;

    //Come per il caso equalIgnoreCase ma aggiunge anche il like alla condizione
    boolean equalIgnoreCaseWithLike() default false;

 }
