package applica.framework.widgets.mapping;

import applica.framework.Entity;
import applica.framework.library.utils.TypeUtils;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class DefaultEntityMapper implements EntityMapper {

    private Log logger = LogFactory.getLog(getClass());

    private List<String> ignoreProperties = new ArrayList<>();
    private List<PropertyMappingInfo> propertyMappingInfos = new ArrayList<>();

    @Override
    public void mapFormValuesFromEntity(Class<? extends Entity> entityType, Map<String, Object> values, Entity entity) throws MappingException {
        if (entity != null) {
            logger.info("Filling values from entity");

            values.put("id", entity.getId());

            List<Field> fields = TypeUtils.getAllFields(entityType);

            for (Field field : fields) {
                String name = field.getName();
                if (ignoreProperties.contains(name)) continue;

                PropertyMapper propertyMapper = getCustomMapper(name, entityType);
                if (propertyMapper == null) {
                    propertyMapper = new DefaultPropertyMapper();
                }

                propertyMapper.toFormValue(name, values, entity);
            }
        }
    }

    @Override
    public void mapEntityFromRequestValues(Class<? extends Entity> entityType, Entity entity, Map<String, String[]> requestValues) throws MappingException {
        logger.info("Filling entity from values");

        //set id manually
        if (requestValues.containsKey("id")) {
            try {
                BeanUtils.setProperty(entity, "id", requestValues.get("id"));
            } catch (Exception e) {
                throw new MappingException("id", e);
            }
        }

        List<Field> fields = TypeUtils.getAllFields(entityType);

        for (Field field : fields) {
            String name = field.getName();
            if (ignoreProperties.contains(name)) continue;

            PropertyMapper mapper = getCustomMapper(name, entityType);
            if (mapper == null) {
                mapper = new DefaultPropertyMapper();
            }

            mapper.toEntityProperty(name, entity, requestValues);
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
