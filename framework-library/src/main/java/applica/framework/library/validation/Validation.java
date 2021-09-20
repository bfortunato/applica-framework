package applica.framework.library.validation;

import applica.framework.ApplicationContextProvider;
import applica.framework.Entity;

import java.util.Map;

/**
 * Created by bimbobruno on 14/04/2017.
 */
public class Validation {

    public static <T extends Entity> ValidationResult getValidationResult(T entity) {
        return getValidationResult(entity, new ValidationResult());
    }


    public static <T extends Entity> ValidationResult getValidationResult(T entity, ValidationResult result) {
        Map<String, Validator> validators = ApplicationContextProvider.provide().getBeansOfType(Validator.class);
        for (Validator validator : validators.values()) {
            if (validator.getEntityType().equals(entity.getClass())) {
                validator.validate(entity, result);
            }
        }

        return result;
    }


    public static <T extends Entity> void validate(T entity) throws ValidationException {
        ValidationResult result = getValidationResult(entity);
        if (!result.isValid()) {
            throw new ValidationException(result);
        }
    }

}
