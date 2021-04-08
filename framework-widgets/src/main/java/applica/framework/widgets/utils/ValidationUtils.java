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

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicInteger;

public class ValidationUtils {

    public static boolean canValidate(Entity entity, Validation annotation, Field field) {

        try {
            String functionName = annotation.validationFunction();
            if (StringUtils.hasLength(functionName)) {
                Method method = entity.getClass().getMethod(functionName);
                method.setAccessible(true);
                Boolean result = (Boolean) method.invoke(entity, new Object[] {});
                return result != null? result : false;
            }
        } catch (Exception e) {

        }

        return true;
    }

    public static void validate(Entity entity, ValidationResult result, List<String> excludedProperties) {
        try {
            EntityService entityService = ApplicationContextProvider.provide().getBean(EntityService.class);
            ClassUtils.getAllFields(entity.getClass()).stream().filter(f -> (excludedProperties == null || !excludedProperties.contains(f.getName())) && f.getAnnotation(Validation.class) != null).forEach(field -> {
                try {
                    Object value = field.get(entity);
                    Validation annotation = field.getAnnotation(Validation.class);

                    if (!canValidate(entity, annotation, field))
                        return ;

                    //Validazione "required": il campo deve essere presente e valorizato
                    if (annotation.required() && (Objects.isNull(value) || (value instanceof String && value.equals("")) || (value instanceof List && ((List) value).size() == 0))) {
                        result.reject(StringUtils.hasLength(annotation.rejectField()) ? annotation.rejectField() : field.getName(), StringUtils.hasLength(annotation.rejectMessage())? annotation.rejectMessage():  "validation.field.required");
                    }

                    //VAlidazione "unique": il campo non deve essere presente su altre entità del sistema
                    //TODO: togliere il campo field value che tanto viene preso direttamente dall'entityService
                    if (annotation.unique() && !entityService.isUnique(annotation.uniqueClass().length > 0 ? annotation.uniqueClass()[0] : entity.getClass(), field.getName(), null, entity)) {
                        result.reject(StringUtils.hasLength(annotation.rejectField()) ? annotation.rejectField() : field.getName(), StringUtils.hasLength(annotation.rejectMessage())? annotation.rejectMessage(): "validation.field.alreadyUsed");
                    }

                    if (annotation.validateSubObject() && !Objects.isNull(value)) {
                        ValidationResult subValidationResult = new ValidationResult();
                        if (value instanceof Entity) {
                            try {
                                validate(((Entity)value), subValidationResult, true);
                            } catch (ValidationException e) {
                                e.getValidationResult().getErrors().forEach(subError -> {
                                    result.reject(String.format("%s_%s", field.getName(), subError.getProperty()), subError.getMessage());
                                });
                            }
                        } else if (List.class.isAssignableFrom(value.getClass())) {
                            AtomicInteger i = new AtomicInteger(0);
                            ((List) value).forEach(v -> {
                                try {
                                    validate(((Entity)v), subValidationResult, true);
                                } catch (ValidationException e) {
                                    e.getValidationResult().getErrors().forEach(subError -> result.reject(String.format("%s_%s_%s", field.getName(), i.get(), subError.getProperty()), subError.getMessage()));
                                }
                                i.incrementAndGet();
                            });
                        }

                    }

                    //Validazione greaterThanZero: il campo deve essere maggiore STRETTO di zero
                    if (annotation.greaterThanZero() && Double.valueOf(String.valueOf(field.get(entity))).compareTo(0D) <= 0)
                        result.reject(StringUtils.hasLength(annotation.rejectField()) ? annotation.rejectField() : field.getName(), StringUtils.hasLength(annotation.rejectMessage())? annotation.rejectMessage():  String.format(LocalizationUtils.getInstance().getLocalizedMessage("validation.field.greaterThan"), "0"));

                    //Validazione "positive": il campo deve essere MAGGIORE O UGUALE a zero
                    if (annotation.positive() && Double.valueOf(String.valueOf(field.get(entity))).compareTo(0D) < 0)
                        result.reject(StringUtils.hasLength(annotation.rejectField()) ? annotation.rejectField() : field.getName(), StringUtils.hasLength(annotation.rejectMessage())? annotation.rejectMessage():  LocalizationUtils.getInstance().getMessage("validation.field.positiveNumber"));

                    //Validazione "range":

                    if (StringUtils.hasLength(annotation.rangeType())) {
                        try {
                            Object otherValue = PropertyUtils.getProperty(entity, annotation.rangeOtherValue());
                            if (otherValue != null && value != null) {
                                switch (annotation.rangeOperator()) {
                                    case Validation.GT:
                                        if (((Comparable<Object>) value).compareTo(otherValue) <= 0)
                                            result.reject(StringUtils.hasLength(annotation.rejectField()) ? annotation.rejectField() : field.getName(), StringUtils.hasLength(annotation.rejectMessage())? annotation.rejectMessage(): String.format(LocalizationUtils.getInstance().getMessage("validation.field.greaterThan"), otherValue.toString()));
                                        break;
                                    case Validation.GTE:
                                        if (((Comparable<Object>) value).compareTo(otherValue) < 0)
                                            result.reject(StringUtils.hasLength(annotation.rejectField()) ? annotation.rejectField() : field.getName(), StringUtils.hasLength(annotation.rejectMessage())? annotation.rejectMessage():  String.format(LocalizationUtils.getInstance().getMessage("validation.field.greaterThanOrEqual"), otherValue.toString()));

                                        break;
                                    case Validation.LT:
                                        if (((Comparable<Object>) value).compareTo(otherValue) >= 0)
                                            result.reject(StringUtils.hasLength(annotation.rejectField()) ? annotation.rejectField() : field.getName(), StringUtils.hasLength(annotation.rejectMessage())? annotation.rejectMessage(): String.format(LocalizationUtils.getInstance().getMessage("validation.field.greaterThanOrEqual"), otherValue.toString()));

                                        break;
                                    case Validation.LTE:
                                        if (((Comparable<Object>) value).compareTo(otherValue) > 0)
                                            result.reject(StringUtils.hasLength(annotation.rejectField()) ? annotation.rejectField() : field.getName(),StringUtils.hasLength(annotation.rejectMessage())? annotation.rejectMessage():  String.format(LocalizationUtils.getInstance().getLocalizedMessage("validation.field.lowerThanOrEqual"), otherValue.toString()));
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

        } catch (Exception e) {

        }

    }

    public static void validate(Entity entity, ValidationResult result) {
        validate(entity, result, new ArrayList<>());
    }

    public static void validate(Entity entity, ValidationResult result, boolean considerStandaloneValidator) throws ValidationException {
        validate(entity, result, new ArrayList<>());
        if (considerStandaloneValidator) {
            ValidationResult standaloneResult = applica.framework.library.validation.Validation.getValidationResult(entity);
            result.getErrors().addAll(standaloneResult.getErrors());
        }
        if (!result.isValid()) {
            throw new ValidationException(result);
        }
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
