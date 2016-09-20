package applica.framework.widgets.processors;

import applica.framework.widgets.Form;
import applica.framework.widgets.FormProcessException;
import applica.framework.ValidationResult;
import applica.framework.Entity;

import java.util.Map;

/**
 * Represents the base interface for form data to entity data conversions
 */
public interface FormProcessor {
    /**
     * Convert request values in entity
     * @param form
     * @param type
     * @param requestValues
     * @param validationResult
     * @return
     * @throws FormProcessException
     */
    Entity toEntity(Form form, Class<? extends Entity> type, Map<String, String[]> requestValues, ValidationResult validationResult) throws FormProcessException;

    /**
     * Convert entity in a map of values that can be used in rendering system
     * @param form
     * @param entity
     * @return
     * @throws FormProcessException
     */
    Map<String, Object> toMap(Form form, Entity entity) throws FormProcessException;
}
