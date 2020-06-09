package applica.framework.widgets.utils;

import applica.framework.ApplicationContextProvider;
import applica.framework.Entity;
import applica.framework.library.i18n.LocalizationUtils;
import applica.framework.library.validation.ValidationException;
import applica.framework.library.validation.ValidationResult;
import applica.framework.security.EntityService;
import applica.framework.widgets.annotations.Validation;
import org.apache.commons.beanutils.PropertyUtils;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class ValidationUtils {

    public static void validate(Entity entity, ValidationResult result, List<String> excludedProperties) {
        EntityService entityService = ApplicationContextProvider.provide().getBean(EntityService.class);
        ClassUtils.getAllFields(entity.getClass()).stream().filter(f -> (excludedProperties == null || !excludedProperties.contains(f.getName())) && f.getAnnotation(Validation.class) != null).forEach(field -> {
            try {
                Object value = field.get(entity);
                Validation annotation = field.getAnnotation(Validation.class);

                //Validazione "required": il campo deve essere presente e valorizato
                if (annotation.required() && (Objects.isNull(value) || (value instanceof String && value.equals("")) || (value instanceof List && ((List) value).size() == 0) )) {
                    result.reject(StringUtils.hasLength(annotation.rejectField())? annotation.rejectField(): field.getName(), "validation.field.required");
                }

                //VAlidazione "unique": il campo non deve essere presente su altre entità del sistema
                if (annotation.unique() && !entityService.isUnique(annotation.uniqueClass().length > 0? annotation.uniqueClass()[0] : entity.getClass(), field.getName(), field.getName(), entity)) {
                    result.reject(StringUtils.hasLength(annotation.rejectField())? annotation.rejectField(): field.getName(), "validation.field.alreadyUsed");
                }

                //Validazione greaterThanZero: il campo deve essere maggiore STRETTO di zero
                if (annotation.greaterThanZero() && Double.valueOf(String.valueOf(field.get(entity))).compareTo(0D) <= 0)
                    result.reject(StringUtils.hasLength(annotation.rejectField())? annotation.rejectField(): field.getName(), String.format(LocalizationUtils.getInstance().getLocalizedMessage("validation.field.greaterThan"), "0"));

                //Validazione "positive": il campo deve essere MAGGIORE O UGUALE a zero
                if (annotation.positive() && Double.valueOf(String.valueOf(field.get(entity))).compareTo(0D) < 0)
                    result.reject(StringUtils.hasLength(annotation.rejectField())? annotation.rejectField(): field.getName(), LocalizationUtils.getInstance().getMessage("validation.field.positiveNumber"));

                //Validazione "range":

                if (StringUtils.hasLength(annotation.rangeType())) {
                    try {
                        Object otherValue = PropertyUtils.getProperty(entity, annotation.rangeOtherValue());
                        if (otherValue != null && value != null) {
                            switch (annotation.rangeOperator()) {
                                case Validation.GT:
                                    if (((Comparable<Object>) value).compareTo(otherValue) <= 0)
                                        result.reject(StringUtils.hasLength(annotation.rejectField())? annotation.rejectField(): field.getName(), String.format(LocalizationUtils.getInstance().getMessage("validation.field.greaterThan"), otherValue.toString()));
                                    break;
                                case Validation.GTE:
                                    if (((Comparable<Object>) value).compareTo(otherValue) < 0)
                                        result.reject(StringUtils.hasLength(annotation.rejectField())? annotation.rejectField(): field.getName(), String.format(LocalizationUtils.getInstance().getMessage("validation.field.greaterThanOrEqual"), otherValue.toString()));

                                    break;
                                case Validation.LT:
                                    if (((Comparable<Object>) value).compareTo(otherValue) >= 0)
                                        result.reject(StringUtils.hasLength(annotation.rejectField())? annotation.rejectField(): field.getName(), String.format(LocalizationUtils.getInstance().getMessage("validation.field.greaterThanOrEqual"), otherValue.toString()));

                                    break;
                                case Validation.LTE:
                                    if (((Comparable<Object>) value).compareTo(otherValue) > 0)
                                        result.reject(StringUtils.hasLength(annotation.rejectField())? annotation.rejectField(): field.getName(), String.format(LocalizationUtils.getInstance().getLocalizedMessage("validation.field.lowerThanOrEqual"), otherValue.toString()));
                                    break;
                            }
                        }

                    } catch (Exception e) {
                        //e.printStackTrace();
                    }
                }
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }

        });
    }

    public static void validate(Entity entity, ValidationResult result) {
        validate(entity, result, new ArrayList<>());
    }

    public static boolean isValid(Entity entity, boolean considerStandaloneValidator, List<String> excludedProperties) {
        ValidationResult result = new ValidationResult();
        validate(entity, result, excludedProperties);

        if (considerStandaloneValidator) {
            try {
                applica.framework.library.validation.Validation.validate(entity);
            } catch (ValidationException e) {
                return false;
            }
        }

        return result.isValid();
    }
}