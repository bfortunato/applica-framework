package applica.framework.library.validation;

import applica.framework.library.i18n.LocalizationUtils;

import java.util.ArrayList;
import java.util.List;

public class ValidationResult {


    //TODO va bene gestito qui?
    /**
     * Rappresenta la modalità di validazione richiesta "al volo"; tramite questo flag verranno inclusi nella validazione anche i field valdiati con il flag "onlyWarning"
     * che rappresentano errori di validazione (warning) non bloccanti.
     */
    private boolean onTheFly;

    List<Error> errors = new ArrayList<>();

    //Se presenti validerà soltanto i field presenti qui utilizzando il metodo "validate" ignorando gli altri
    List<String> allowedProperties;

    public void setOnTheFly(boolean onTheFly) {
        this.onTheFly = onTheFly;
    }

    public interface ValidateCallback {
        boolean isValid();
    }


    public void validate(String field, ValidateCallback validateCallback, String rejectMessage, boolean onlyWarning) {
        if (!validateCallback.isValid())
            this.reject(field, rejectMessage, onlyWarning);

    }


    public void validate(String field, ValidateCallback validateCallback, String rejectMessage) {
        validate(field, validateCallback, rejectMessage, false);
    }


    public void reject(String property, String message) {
        reject(property, message, false);
    }

    public void reject(String property, String message, boolean onlyWarning) {
        if (allowedProperties == null || allowedProperties.contains(property) && (!onlyWarning || this.onTheFly)) {
            Error error = new Error(property, LocalizationUtils.getInstance().getMessage(message));
            error.setWarning(onlyWarning);
            errors.add(error);
        }
    }

    public boolean isValid() {
        return errors != null && errors.stream().filter(error -> (!error.isWarning() || this.onTheFly)).count() == 0;
    }

    public List<Error> getErrors() {
        return errors;
    }

    public boolean isValid(String property) {
        for (Error error : errors) {
            if (error.getProperty().equals(property) && (!error.isWarning() || this.onTheFly)) {
                return false;
            }
        }
        return true;
    }

    public String getErrorMessage(String property) {
        for (Error error : errors) {
            if (error.getProperty().equals(property)) {
                return error.getMessage();
            }
        }

        return null;
    }

    public List<String> getAllowedProperties() {
        return allowedProperties;
    }

    public void setAllowedProperties(List<String> allowedProperties) {
        this.allowedProperties = allowedProperties;
    }

    public boolean isOnTheFly() {
        return onTheFly;
    }

    public class Error {
        private String property;
        private String message;
        private boolean warning; //questo errore rappresenta un "warning" non bloccante

        public Error(String property, String message) {
            super();
            this.property = property;
            this.message = message;
        }

        public String getProperty() {
            return property;
        }

        public void setProperty(String property) {
            this.property = property;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public boolean isWarning() {
            return warning;
        }

        public void setWarning(boolean warning) {
            this.warning = warning;
        }
    }
}
