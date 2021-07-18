package applica.framework.widgets.annotations;



import java.lang.annotation.*;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Validations {
    Validation[] value();
}
