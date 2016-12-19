package applica.framework.widgets.processors;

import applica.framework.Entity;
import applica.framework.ValidationResult;
import applica.framework.widgets.mapping.EntityMapper;
import applica.framework.widgets.mapping.MappingException;
import applica.framework.widgets.mapping.DefaultEntityMapper;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.util.HashMap;
import java.util.Map;

public class SimpleFormProcessor implements FormProcessor {

    protected Log logger = LogFactory.getLog(getClass());

    private Class<? extends Entity> entityType;

    protected Entity instantiateEntity(Class<? extends Entity> type, Map<String, String[]> requestValues, ValidationResult validationResult) throws FormProcessException {
        Entity entity = null;

        try {
            entity = type.newInstance();
        } catch (Exception e) {
            logger.error("Error instanziating entity:" + type.getName());
            throw new FormProcessException("Error instanziating entity", e);
        }

        return entity;
    }

    @Override
    public Entity toEntity(Class<? extends Entity> type, Map<String, String[]> requestValues, ValidationResult validationResult) throws FormProcessException, FormProcessException {
        Entity entity = instantiateEntity(type, requestValues, validationResult);

        EntityMapper mapper = getFormDataMapper();
        try {
            mapper.mapEntityFromRequestValues(entityType, entity, requestValues);
        } catch (MappingException e) {
            validationResult.rejectValue(e.getProperty(), e.getCause().getMessage());
        }

        if(validationResult != null) {
            validate(entity, validationResult);
        }

        return entity;
    }

    protected void validate(Entity entity, ValidationResult validationResult) {
    }

    @Override
    public Map<String, Object> toMap(Entity entity) throws FormProcessException, FormProcessException {
        Map<String, Object> values = new HashMap<>();
        EntityMapper mapper = getFormDataMapper();
        try {
            mapper.mapFormValuesFromEntity(entityType, values, entity);
        } catch (MappingException e) {
            throw new FormProcessException(e);
        }

        return values;
    }

    protected EntityMapper getFormDataMapper() {
        DefaultEntityMapper mapper = new DefaultEntityMapper();
        return mapper;
    }

    @Override
    public Class<? extends Entity> getEntityType() {
        return entityType;
    }

    public void setEntityType(Class<? extends Entity> entityType) {
        this.entityType = entityType;
    }
}
