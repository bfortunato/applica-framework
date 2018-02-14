package applica.framework.library.utils;


import applica.framework.library.i18n.Localization;
import applica.framework.library.validation.ValidationResult;
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
            errorMessages = String.format("%s%s<br>", errorMessages, localization.getMessage(error.getDefaultMessage()));
        }
        return errorMessages;
    }

    public static String getAllErrorMessages(List<ValidationResult.Error> errors) {
        Localization localization = new Localization();
        String errorMessages = "";
        for(ValidationResult.Error error: errors) {
            errorMessages = String.format("%s - %s", errorMessages, localization.getMessage(error.getMessage()));
        }
        return errorMessages;
    }
}
