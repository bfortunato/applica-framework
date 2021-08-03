package applica.framework.library.validation;

import applica.framework.library.i18n.LocalizationUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class ValidationResult {


    public void setOnTheFly(boolean onTheFly) {
        this.onTheFly = onTheFly;
    }

    public interface ValidateCallback {
        boolean isValid();
    }

    private boolean onTheFly; //se false esclude dalla validazione i campi

    List<Error> errors = new ArrayList<>();

    //Se presenti validerà soltanto i field presenti qui utilizzando il metodo "validate"
    List<String> allowedFields;


    public void validate(String field, ValidateCallback validateCallback, String rejectMessage) {

        validate(field, validateCallback, rejectMessage, false);
    }

    public void validate(String field, ValidateCallback validateCallback, String rejectMessage, boolean onlyOnTheFly) {
        if (allowedFields == null || allowedFields.contains(field) && (!onlyOnTheFly ||  this.onTheFly)) {
            if (!validateCallback.isValid())
                this.reject(field, rejectMessage);
        }
    }

    /**
     * Bisogna usare la nuova funzione validate per tenere in considerazione il contenuto della lista allowedFields
     * @param property
     * @param message
     */
    public void reject(String property, String message) {
        errors.add(new Error(property, LocalizationUtils.getInstance().getMessage(message)));
    }

    public boolean isValid() {
        return errors != null && errors.size() == 0;
    }

    public List<Error> getErrors() {
        return errors;
    }

    public boolean isValid(String property) {
        for(Error error : errors) {
            if(error.getProperty().equals(property)) {
                return false;
            }
        }

        return true;
    }

    public String getErrorMessage(String property) {
        for(Error error : errors) {
            if(error.getProperty().equals(property)) {
                return error.getMessage();
            }
        }

        return null;
    }

    public List<String> getAllowedFields() {
        return allowedFields;
    }

    public void setAllowedFields(List<String> allowedFields) {
        this.allowedFields = allowedFields;
    }

    public boolean isOnTheFly() {
        return onTheFly;
    }

    public class Error {
        private String property;
        private String message;

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

    }
}
