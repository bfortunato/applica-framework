package applica.framework.library.utils;

import org.apache.commons.beanutils.converters.DateConverter;
import org.apache.commons.beanutils.converters.DateTimeConverter;
import org.apache.commons.lang3.StringUtils;

import java.util.Date;

/**
 * Created by bimbobruno on 02/04/15.
 */
public class NullableDateConverter extends DateTimeConverter {

    public NullableDateConverter() {
    }

    public NullableDateConverter(Object defaultValue) {
        super(defaultValue);
    }

    @Override
    protected Class getDefaultType() {
        return Date.class;
    }

    @Override
    protected Object convertToType(Class targetType, Object value) throws Exception {
        if (value instanceof String) {
            String stringValue = (String) value;
            if (StringUtils.isEmpty(stringValue)) {
                return null;
            }
        }

        return super.convertToType(targetType, value);
    }
}
