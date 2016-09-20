package applica.framework.widgets.forms.processors;

import applica.framework.Entity;
import applica.framework.ValidationResult;
import applica.framework.library.i18n.Localization;
import applica.framework.widgets.CrudConfiguration;
import applica.framework.widgets.Form;
import applica.framework.widgets.FormProcessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.validation.Validator;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class BaseFormProcessor extends ValidateableFormProcessor {

    @Autowired
    private ApplicationContext applicationContext;

    @Override
    public Map<String, Object> toMap(Form form, Entity entity) throws FormProcessException {
        configure(form);

        return super.toMap(form, entity);
    }

    @Override
    public Entity toEntity(Form form, Class<? extends Entity> type, Map<String, String[]> requestValues, ValidationResult validationResult) throws FormProcessException {
        configure(form);

        return super.toEntity(form, type, requestValues, validationResult);
    }

    void configure(Form form) {
        List<Validator> validators = new ArrayList<>();

        Class<? extends Entity> entityType = CrudConfiguration.instance().getFormTypeFromIdentifier(form.getIdentifier());

        applicationContext.getBeansOfType(Validator.class).values().stream()
                .filter(r -> r.supports(entityType))
                .findFirst()
                .ifPresent(validators::add);

        setValidators(validators);

        Localization localization = new Localization(applicationContext);
        setLocalization(localization);
    }
}
