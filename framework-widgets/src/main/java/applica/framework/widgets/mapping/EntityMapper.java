package applica.framework.widgets.mapping;

import applica.framework.Entity;

import java.util.Map;

public interface EntityMapper {
    void mapFormValuesFromEntity(Class<? extends Entity> entityType, Map<String, Object> values, Entity entity) throws MappingException;

    void mapEntityFromRequestValues(Class<? extends Entity> entityType, Entity entity, Map<String, String[]> requestValues) throws MappingException;
}
