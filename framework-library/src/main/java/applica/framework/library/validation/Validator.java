package applica.framework.library.validation;

import applica.framework.Entity;

/**
 * Created by bimbobruno on 14/04/2017.
 */
public interface Validator<T extends Entity> {

    void validate(T entity, ValidationResult result);
    Class<T> getEntityType();

}
