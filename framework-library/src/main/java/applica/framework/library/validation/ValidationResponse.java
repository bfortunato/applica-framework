package applica.framework.library.validation;

import applica.framework.library.responses.Response;
import applica.framework.library.validation.ValidationResult;

/**
 * Created by bimbobruno on 15/11/2016.
 */
public class ValidationResponse extends Response {

    private final ValidationResult result;

    public ValidationResponse(int responseCode, ValidationResult result) {
        super(responseCode);

        this.result = result;
    }

    public ValidationResult getResult() {
        return result;
    }
}
