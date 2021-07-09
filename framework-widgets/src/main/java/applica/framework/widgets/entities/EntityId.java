package applica.framework.widgets.entities;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Created by bimbobruno on 06/12/2016.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface EntityId {
    String value();
    boolean allowRevision() default false;
    boolean automaticCodeGeneration() default false;


    //Ruoli associati a tutti i crudPermission
    String [] completePermissionsRoles() default {};

    //Ruoli associati al permesso di salvataggio entità
    String [] savePermissionsRoles() default {};

    //Ruoli associati al permesso di visualizzazione entità
    String [] viewPermissionsRoles() default {};

    //Ruoli associati al permesso di eliminazione entità
    String [] deletePermissionsRoles() default {};

    //Ruoli associati al permesso di list entità
    String [] listPermissionsRoles() default {};

    //Ruoli associati al permesso di creazione entità
    String [] creationPermissionsRoles() default {};
}
