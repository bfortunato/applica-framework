package applica.framework.widgets.mapping;

import applica.framework.widgets.FormDescriptor;
import applica.framework.widgets.FormField;
import applica.framework.Entity;
import com.fasterxml.jackson.databind.JavaType;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.util.StringUtils;

import java.util.Map;

public class JsonPropertyMapper implements PropertyMapper {

    private Log logger = LogFactory.getLog(getClass());

    @Override
    public void toFormValue(FormDescriptor formDescriptor, FormField formField, Map<String, Object> values, Entity entity)
            throws MappingException {

        if (entity != null) {
            try {
                Object value = PropertyUtils.getSimpleProperty(entity, formField.getProperty());
                if (value != null) {
                    logger.info(String.format("converting %s to json", formField.getProperty()));

                    ObjectMapper jsonMapper = new ObjectMapper();
                    String json = jsonMapper.writeValueAsString(value);
                    values.put(formField.getProperty(), json);

                    logger.info(json);
                }
            } catch (Exception e) {
                e.printStackTrace();
                throw new MappingException(formField.getProperty(), e);
            }
        }
    }

    @Override
    public void toEntityProperty(FormDescriptor formDescriptor, FormField formField, Entity entity, Map<String, String[]> requestValues)
            throws MappingException {

        if (entity != null) {
            try {
                String[] value = requestValues.get(formField.getProperty());
                if (value != null) {
                    String json = value[0];
                    if (StringUtils.hasLength(json)) {
                        logger.info(String.format("converting json into %s", formField.getProperty()));
                        logger.info(json);

                        ObjectMapper jsonMapper = new ObjectMapper();
                        JavaType type = jsonMapper.getTypeFactory().constructType(formField.getDataType());
                        Object propertyValue = jsonMapper.readValue(json, type);
                        PropertyUtils.setSimpleProperty(entity, formField.getProperty(), propertyValue);

                        logger.info("conversion successfull");
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
                throw new MappingException(formField.getProperty(), e);
            }
        }
    }

}
