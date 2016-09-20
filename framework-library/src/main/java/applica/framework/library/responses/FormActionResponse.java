package applica.framework.library.responses;

import applica.framework.ValidationResult;

public class FormActionResponse extends SimpleResponse {
    private boolean valid;
    private ValidationResult validationResult;
    private String after;

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public ValidationResult getValidationResult() {
        return validationResult;
    }

    public void setValidationResult(ValidationResult validationResult) {
        this.validationResult = validationResult;
    }

    public String getAfter() {
        return after;
    }

    public void setAfter(String after) {
        this.after = after;
    }
}
