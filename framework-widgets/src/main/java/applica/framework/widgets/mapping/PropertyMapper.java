package applica.framework.widgets.mapping;

import applica.framework.widgets.FormDescriptor;
import applica.framework.widgets.FormField;
import applica.framework.Entity;

import java.util.Map;

/**
 * Represents the base interface to map form properties
 */
public interface PropertyMapper {
    /**
     * Map entity property specified by form field to a form value
     * @param formDescriptor
     * @param formField
     * @param values
     * @param entity
     * @throws MappingException
     */
    void toFormValue(FormDescriptor formDescriptor, FormField formField, Map<String, Object> values, Entity entity) throws MappingException;

    /**
     * Map request value to an entity property specified in form field
     * @param formDescriptor
     * @param formField
     * @param entity
     * @param requestValues
     * @throws MappingException
     */
    void toEntityProperty(FormDescriptor formDescriptor, FormField formField, Entity entity, Map<String, String[]> requestValues) throws MappingException;
}
