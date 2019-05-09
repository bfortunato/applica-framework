package applica.framework.library.utils;


import applica.framework.library.i18n.Localization;
import applica.framework.library.validation.ValidationResult;
import org.springframework.util.StringUtils;
import org.springframework.validation.Errors;
import org.springframework.validation.ObjectError;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by antoniolovicario on 11/05/15.
 */
public class ErrorsUtils {

    // Prevent initialization
    private ErrorsUtils() { }

    public static String getAllErrorMessages(Errors errors) {
        String errorMessages = "";
        for(ObjectError error: errors.getAllErrors()) {
            errorMessages = String.format("%s%s: %s<br>",  errorMessages, getMessage(error.getObjectName()), getMessage(error.getDefaultMessage()));
        }
        return errorMessages;
    }

    public static String getAllErrorMessages(List<ValidationResult.Error> errors) {

        return getAllErrorMessages(errors, null);
    }

    public static String getAllErrorMessages(List<ValidationResult.Error> errors, String errorSeparator) {

        String errorMessages = "";
        String separator = StringUtils.hasLength(errorSeparator) ? errorSeparator : "";

        errorMessages = errors.stream().map(error -> String.format("%s: %s", getMessage(error.getProperty()), getMessage(error.getMessage()))).collect(Collectors.joining(separator));

        return errorMessages;
    }

    public static String getMessage(String label) {
        Localization localization = new Localization();
        return localization.getMessage(label);
    }
 }
