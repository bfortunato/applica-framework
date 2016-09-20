package applica.framework.widgets.mapping;

import applica.framework.Entity;
import applica.framework.widgets.CrudConfiguration;
import applica.framework.widgets.CrudConfigurationException;
import applica.framework.widgets.FormDescriptor;
import applica.framework.widgets.FormField;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class SimpleFormDataMapper implements FormDataMapper {

    private Log logger = LogFactory.getLog(getClass());

    private List<String> ignoreProperties = new ArrayList<>();
    private List<PropertyMappingInfo> propertyMappingInfos = new ArrayList<>();

    @Override
    public void mapFormValuesFromEntity(FormDescriptor formDescriptor, Map<String, Object> values, Entity entity) throws MappingException {

        if (entity != null) {
            logger.info("Filling values from entity");

            values.put("id", entity.getId());

            for (FormField formField : formDescriptor.getVisibleFields()) {
                if (ignoreProperties.contains(formField.getProperty())) continue;

                PropertyMapper propertyMapper = getCustomMapper(formField.getProperty(), entity != null ? entity.getClass() : null);
                if (propertyMapper == null) {
                    propertyMapper = new SimplePropertyMapper();
                }

                propertyMapper.toFormValue(formDescriptor, formField, values, entity);
            }
        }
    }

    @Override
    public void mapEntityFromRequestValues(FormDescriptor formDescriptor, Entity entity, Map<String, String[]> requestValues) throws MappingException {
        logger.info("Filling entity from values");

        //set id manually
        if (requestValues.containsKey("id")) {
            try {
                BeanUtils.setProperty(entity, "id", requestValues.get("id"));
            } catch (Exception e) {
                throw new MappingException("id", e);
            }
        }

        for (FormField formField : formDescriptor.getVisibleFields()) {
            if (ignoreProperties.contains(formField.getProperty())) continue;

            PropertyMapper mapper = getCustomMapper(formField.getProperty(), entity != null ? entity.getClass() : null);
            if (mapper == null) {
                mapper = new SimplePropertyMapper();
            }

            mapper.toEntityProperty(formDescriptor, formField, entity, requestValues);
        }
    }

    public List<String> getIgnoreProperties() {
        return ignoreProperties;
    }

    public void setIgnoreProperties(List<String> ignoreProperties) {
        this.ignoreProperties = ignoreProperties;
    }

    private PropertyMapper getCustomMapper(String property, Class<? extends Entity> type) {
        PropertyMapper mapper = null;

        for (PropertyMappingInfo info : propertyMappingInfos) {
            if (info.property.equals(property))
                mapper = info.mapper;
        }

        //check from crud configuration
        if (type != null) {
            try {
                mapper = CrudConfiguration.instance().getPropertyMapper(type, property);
            } catch (CrudConfigurationException e) {
                throw new RuntimeException(e);
            }
        }

        return mapper;
    }

    public void registerMapper(String property, PropertyMapper mapper) {
        PropertyMappingInfo info = new PropertyMappingInfo();
        info.mapper = mapper;
        info.property = property;
        propertyMappingInfos.add(info);
    }

    private class PropertyMappingInfo {
        private String property;
        private PropertyMapper mapper;
    }
}
