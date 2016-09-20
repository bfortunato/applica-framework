package applica.framework.library.utils;

import applica.framework.ValidationException;
import applica.framework.ValidationResult;
import applica.framework.library.i18n.Localization;
import org.springframework.validation.FieldError;
import org.springframework.validation.MapBindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.validation.Validator;

import java.text.MessageFormat;
import java.util.HashMap;
import java.util.Map;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 29/10/13
 * Time: 11:41
 */
public class ValidationUtils {

    public static final void validate(Validator validator, Object obj, Localization localization) throws ValidationException {

        if (validator != null) {
            Map<Object, Object> map = new HashMap<>();
            MapBindingResult result = new MapBindingResult(map, obj.getClass().getName());
            validator.validate(obj, result);
            ValidationResult validationResult = new ValidationResult();
            if (result.hasErrors()) {
                for (ObjectError error : result.getAllErrors()) {
                    FieldError ferror = (FieldError) error;
                    Object[] arguments = error.getArguments();
                    if (ferror != null) {
                        String message = error.getDefaultMessage();
                        if (localization != null) {
                            message = localization.getMessage(message);
                        }
                        if( arguments != null && arguments.length > 0){
                            message = MessageFormat.format(message,arguments);
                        }
                        validationResult.rejectValue(ferror.getField(), message);
                    }
                }
            }

            if(!validationResult.isValid()) {
                throw new ValidationException(validationResult);
            }
        }
    }

}
