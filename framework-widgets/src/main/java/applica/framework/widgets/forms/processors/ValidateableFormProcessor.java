package applica.framework.widgets.forms.processors;

import applica.framework.ValidationResult;
import applica.framework.Entity;
import applica.framework.library.i18n.Localization;
import applica.framework.widgets.processors.LoadFirstFormProcessor;
import org.springframework.validation.FieldError;
import org.springframework.validation.MapBindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.validation.Validator;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ValidateableFormProcessor extends LoadFirstFormProcessor {

    private List<Validator> validators;
    private Localization localization;

    public Localization getLocalization() {
        return localization;
    }

    public void setLocalization(Localization localization) {
        this.localization = localization;
    }

    public List<Validator> getValidators() {
        return validators;
    }

    public void setValidators(List<Validator> validators) {
        this.validators = validators;
    }

    @Override
    protected void validate(Entity entity, ValidationResult validationResult) {
        if (validators != null) {
            Map<Object, Object> map = new HashMap<>();
            MapBindingResult result = new MapBindingResult(map, entity.getClass().getName());
            validators.forEach(v -> v.validate(entity, result));

            if (result.hasErrors()) {
                for (ObjectError error : result.getAllErrors()) {
                    FieldError ferror = (FieldError) error;
                    if (ferror != null) {
                        String message = error.getDefaultMessage();
                        if (localization != null) {
                            message = localization.getMessage(message);
                        }
                        validationResult.rejectValue(ferror.getField(), message);
                    }
                }
            }
        }
    }
}
