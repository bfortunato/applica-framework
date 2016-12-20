package applica.framework.widgets.processors;

import applica.framework.Entity;
import applica.framework.ValidationResult;

import java.util.Map;

/**
 * Represents the base interface for form data to entity data conversions
 */
public interface FormProcessor {
    /**
     * Convert request values in entity
     * @param type
     * @param requestValues
     * @param validationResult
     * @return
     * @throws FormProcessException
     */
    Entity toEntity(Class<? extends Entity> type, Map<String, String[]> requestValues, ValidationResult validationResult) throws FormProcessException;

    /**
     * Convert entity in a map of values that can be used in rendering system
     * @param entity
     * @return
     * @throws FormProcessException
     */
    Map<String, Object> toMap(Entity entity) throws FormProcessException;

    /**
     * Returns the type of entity that will be created in the processing phase. This is also used to select the correct processor for entity in FormProcessorFactory
     * @return
     */
    Class<? extends Entity> getEntityType();
}
