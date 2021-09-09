package applica.framework.widgets.utils;

import applica.framework.ApplicationContextProvider;
import applica.framework.Entity;
import applica.framework.Query;
import applica.framework.library.i18n.LocalizationUtils;
import applica.framework.library.validation.ValidationException;
import applica.framework.library.validation.ValidationResult;
import applica.framework.security.EntityService;
import applica.framework.widgets.annotations.Validation;
import org.apache.commons.beanutils.PropertyUtils;
import org.springframework.util.StringUtils;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

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

    public static Query generateUniqueQuery(Entity entity, Validation annotation) {

        try {
            String functionName = annotation.uniqueQueryFunction();
            if (StringUtils.hasLength(functionName)) {
                Method method = entity.getClass().getMethod(functionName);
                method.setAccessible(true);
                Query result = (Query) method.invoke(entity, new Object[] {});
                return result;
            }
        } catch (Exception e) {

        }

        return null;
    }

    //TODO: utilizzarla al posto di ogni reject del metodo "validate"
    public static void reject(ValidationResult validationResult, Validation annotation, Field field, String message) {
        validationResult.reject(StringUtils.hasLength(annotation.rejectField()) ? annotation.rejectField() : field.getName(), StringUtils.hasLength(annotation.rejectMessage())? annotation.rejectMessage(): message);
    }

    public static void validate(Entity entity, ValidationResult result, List<String> excludedProperties) {
        try {
            EntityService entityService = ApplicationContextProvider.provide().getBean(EntityService.class);
            List<Field> allFields = ClassUtils.getAllFields(entity.getClass());
            allFields.stream().filter(f -> (excludedProperties == null || !excludedProperties.contains(f.getName())) && getValidations(f).size() > 0).forEach(field -> {
                try {
                    Object value = field.get(entity);
                    getValidations(field).forEach(validationAnnotation -> {

                        try {
                            Validation annotation = ((Validation) validationAnnotation);

                            if (annotation.isOnlyOnTheFly() && !result.isOnTheFly())
                                return;

                            if (!canValidate(entity, annotation, field))
                                return ;


                            if (annotation.maxLength() >= 0){
                                if (String.class.isAssignableFrom(field.getType()) && value != null)
                                    //TODO attualmente supportato solo per le stringhe, prevedere un futuro le liste
                                    if (((String) value).length() > annotation.maxLength())
                                        reject(result, annotation, field, String.format(LocalizationUtils.getInstance().getMessage("validation.field.maxLength"), annotation.maxLength()));

                            }


                            //Validazione "required": il campo deve essere presente e valorizato
                            if (annotation.required() && (Objects.isNull(value) || (value instanceof String && value.equals("")) || (value instanceof List && ((List) value).size() == 0))) {
                                result.reject(StringUtils.hasLength(annotation.rejectField()) ? annotation.rejectField() : field.getName(), StringUtils.hasLength(annotation.rejectMessage())? annotation.rejectMessage():  "validation.field.required");
                            } else {

                            }

                            //VAlidazione "unique": il campo non deve essere presente su altre entità del sistema
                            //TODO: togliere il campo field value che tanto viene preso direttamente dall'entityService
                            if (annotation.unique()) {
                                Query uniqueQuery = generateUniqueQuery(entity, annotation);
                                if (!entityService.isUnique(annotation.uniqueClass().length > 0 ? annotation.uniqueClass()[0] : entity.getClass(), field.getName(), null, entity, uniqueQuery))
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
                                            e.getValidationResult().getErrors().forEach(subError -> {

                                                String property = null;
                                                if (annotation.subObjectSimplifiedErrorMessages()) {
                                                    property = String.format("%s %s, %s", LocalizationUtils.getInstance().getMessage("row"), i.get() + 1, LocalizationUtils.getInstance().getMessage(subError.getProperty()));
                                                } else
                                                    property = String.format("%s_%s_%s", field.getName(), i.get(), subError.getProperty());

                                                result.reject(property, subError.getMessage());
                                            });
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

                            if (StringUtils.hasLength(annotation.rangeOperator())) {
                                try {
                                    Object otherValue = PropertyUtils.getProperty(entity, annotation.rangeOtherValue());
                                    Field otherValueField = allFields.stream().filter(f -> f.getName().equals(annotation.rangeOtherValue())).findFirst().get();
                                    if (otherValue != null && value != null) {
                                        switch (annotation.rangeOperator()) {
                                            //attualmente non esiste un modo per differenioare i custom rejectMessage ed è stato disattivato per i range. Bisogna trovare una soluzione
                                            case Validation.GT:
                                                if (((Comparable<Object>) value).compareTo(otherValue) <= 0)
                                                    result.reject(StringUtils.hasLength(annotation.rejectField()) ? annotation.rejectField() : field.getName(),  StringUtils.hasLength(annotation.rejectMessage())? annotation.rejectMessage(): String.format(LocalizationUtils.getInstance().getMessage("validation.field.greaterThan"), LocalizationUtils.getInstance().getMessage(otherValueField.getName())));
                                                break;
                                            case Validation.GTE:
                                                if (((Comparable<Object>) value).compareTo(otherValue) < 0)
                                                    result.reject(StringUtils.hasLength(annotation.rejectField()) ? annotation.rejectField() : field.getName(), StringUtils.hasLength(annotation.rejectMessage())? annotation.rejectMessage():  String.format(LocalizationUtils.getInstance().getMessage("validation.field.greaterThanOrEqual"), LocalizationUtils.getInstance().getMessage(otherValueField.getName())));

                                                break;
                                            case Validation.LT:
                                                if (((Comparable<Object>) value).compareTo(otherValue) >= 0)
                                                    result.reject(StringUtils.hasLength(annotation.rejectField()) ? annotation.rejectField() : field.getName(), StringUtils.hasLength(annotation.rejectMessage())? annotation.rejectMessage(): String.format(LocalizationUtils.getInstance().getMessage("validation.field.greaterThanOrEqual"), LocalizationUtils.getInstance().getMessage(otherValueField.getName())));

                                                break;
                                            case Validation.LTE:
                                                if (((Comparable<Object>) value).compareTo(otherValue) > 0)
                                                    result.reject(StringUtils.hasLength(annotation.rejectField()) ? annotation.rejectField() : field.getName(), StringUtils.hasLength(annotation.rejectMessage())? annotation.rejectMessage():  String.format(LocalizationUtils.getInstance().getLocalizedMessage("validation.field.lowerThanOrEqual"), LocalizationUtils.getInstance().getMessage(otherValueField.getName())));
                                                break;
                                        }
                                    }

                                } catch (Exception e) {
                                    //e.printStackTrace();
                                }
                            }
                        } catch (Exception e) {

                        }
                    });

                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                }

            });

        } catch (Exception e) {

        }

    }

    private static List<Annotation> getValidations(Field f) {
       return Arrays.asList(f.getDeclaredAnnotationsByType(Validation.class));
    }

    public static void validate(Entity entity, ValidationResult result) {

        validate(entity, result, new ArrayList<>());
    }

    public static void validate(Entity entity, ValidationResult result, boolean considerStandaloneValidator) throws ValidationException {
        List<String> excludedProperties = new ArrayList<>();

        if (result.getAllowedProperties() != null && result.getAllowedProperties().size() > 0) {
            List<Field> list = ClassUtils.getAllFields(entity.getClass());
            excludedProperties.addAll(list.stream().filter(f -> !result.getAllowedProperties().contains(f.getName())).map(f -> f.getName()).collect(Collectors.toList()));
        }

        validate(entity, result, excludedProperties);

        if (considerStandaloneValidator) {
            applica.framework.library.validation.Validation.getValidationResult(entity, result);
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
