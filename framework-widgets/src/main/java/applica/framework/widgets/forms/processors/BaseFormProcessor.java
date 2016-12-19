package applica.framework.widgets.forms.processors;

import applica.framework.Entity;
import applica.framework.ValidationResult;
import applica.framework.library.i18n.Localization;
import applica.framework.widgets.processors.FormProcessException;
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
    public Map<String, Object> toMap(Entity entity) throws FormProcessException {
        configure();

        return super.toMap(entity);
    }

    @Override
    public Entity toEntity(Class<? extends Entity> type, Map<String, String[]> requestValues, ValidationResult validationResult) throws FormProcessException {
        return super.toEntity(type, requestValues, validationResult);
    }

    void configure() {
        List<Validator> validators = new ArrayList<>();

        applicationContext.getBeansOfType(Validator.class).values().stream()
                .filter(r -> r.supports(getEntityType()))
                .findFirst()
                .ifPresent(validators::add);

        setValidators(validators);

        Localization localization = new Localization(applicationContext);
        setLocalization(localization);
    }
}
