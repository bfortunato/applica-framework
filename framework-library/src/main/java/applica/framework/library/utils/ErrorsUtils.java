package applica.framework.library.utils;


import applica.framework.library.i18n.Localization;
import applica.framework.library.validation.ValidationResult;
import org.springframework.util.StringUtils;
import org.springframework.validation.Errors;
import org.springframework.validation.ObjectError;

import java.util.List;

/**
 * Created by antoniolovicario on 11/05/15.
 */
public class ErrorsUtils {

    // Prevent initialization
    private ErrorsUtils() { }

    public static String getAllErrorMessages(Errors errors) {
        Localization localization = new Localization();
        String errorMessages = "";
        for(ObjectError error: errors.getAllErrors()) {
            errorMessages = String.format("%s%s: %s<br>",  errorMessages, localization.getMessage(error.getObjectName()), localization.getMessage(error.getDefaultMessage()));
        }
        return errorMessages;
    }

    public static String getAllErrorMessages(List<ValidationResult.Error> errors) {

        return getAllErrorMessages(errors, null);
    }

    public static String getAllErrorMessages(List<ValidationResult.Error> errors, String errorSeparator) {
        Localization localization = new Localization();
        String errorMessages = "";
        String separator = StringUtils.hasLength(errorSeparator) ? errorSeparator : "";
        for(ValidationResult.Error error: errors) {
            errorMessages = String.format("%s - %s: %s%s", errorMessages, localization.getMessage(error.getProperty()), localization.getMessage(error.getMessage()), separator);
        }
        return errorMessages;
    }
}
