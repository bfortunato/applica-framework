package applica.framework.widgets.mapping;

import applica.framework.Entity;

import java.util.Map;

/**
 * Represents the base interface to map form properties
 */
public interface PropertyMapper {
    /**
     * Map entity property specified by form field to a form value
     * @param name
     * @param values
     * @param entity
     * @throws MappingException
     */
    void toFormValue(String name, Map<String, Object> values, Entity entity) throws MappingException;

    /**
     * Map request value to an entity property specified in form field
     * @param name
     * @param entity
     * @param requestValues
     * @throws MappingException
     */
    void toEntityProperty(String name, Entity entity, Map<String, String[]> requestValues) throws MappingException;
}
