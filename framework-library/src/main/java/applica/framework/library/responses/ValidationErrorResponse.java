package applica.framework.library.responses;

import applica.framework.ValidationResult;

/**
 * Created by bimbobruno on 15/11/2016.
 */
public class ValidationErrorResponse extends Response {

    private final ValidationResult result;

    ValidationErrorResponse(ValidationResult result) {
        super(ERROR);

        this.result = result;
    }

    public ValidationResult getResult() {
        return result;
    }
}
