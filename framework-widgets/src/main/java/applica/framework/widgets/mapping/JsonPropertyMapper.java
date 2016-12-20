package applica.framework.widgets.mapping;

import applica.framework.Entity;
import applica.framework.library.utils.ProgramException;
import applica.framework.library.utils.TypeUtils;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.util.StringUtils;

import java.lang.reflect.Field;
import java.util.Map;

public class JsonPropertyMapper implements PropertyMapper {

    private Log logger = LogFactory.getLog(getClass());

    @Override
    public void toFormValue(String name, Map<String, Object> values, Entity entity)
            throws MappingException {

        if (entity != null) {
            try {
                Object value = PropertyUtils.getSimpleProperty(entity, name);
                if (value != null) {
                    logger.info(String.format("converting %s to json", name));

                    ObjectMapper jsonMapper = new ObjectMapper();
                    String json = jsonMapper.writeValueAsString(value);
                    values.put(name, json);

                    logger.info(json);
                }
            } catch (Exception e) {
                e.printStackTrace();
                throw new MappingException(name, e);
            }
        }
    }

    @Override
    public void toEntityProperty(String name, Entity entity, Map<String, String[]> requestValues)
            throws MappingException {

        if (entity != null) {
            try {
                Field field = TypeUtils.getField(entity.getClass(), name);
                if (field == null) {
                    throw new ProgramException(String.format("Requesting field %s of class %s but not exists", name, entity.getClass().getName()));
                }
                String[] value = requestValues.get(name);
                if (value != null) {
                    String json = value[0];
                    if (StringUtils.hasLength(json)) {
                        logger.info(String.format("converting json into %s", name));
                        logger.info(json);

                        ObjectMapper jsonMapper = new ObjectMapper();
                        JavaType type = jsonMapper.getTypeFactory().constructType(field.getType());
                        Object propertyValue = jsonMapper.readValue(json, type);
                        PropertyUtils.setSimpleProperty(entity, name, propertyValue);

                        logger.info("conversion successfull");
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
                throw new MappingException(name, e);
            }
        }
    }

}
