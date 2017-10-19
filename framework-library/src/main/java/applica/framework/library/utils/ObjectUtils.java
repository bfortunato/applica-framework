package applica.framework.library.utils;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.MutablePropertyValues;
import org.springframework.beans.PropertyValues;
import org.springframework.validation.DataBinder;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * Created by bimbobruno on 03/02/2017.
 */
public class ObjectUtils {

    public static <T> T bind(T target, PropertyValues values) {
        DataBinder binder = new DataBinder(target);
        binder.bind(values);
        return target;
    }

    public static PropertyValues flatten(Object value) {
        MutablePropertyValues flat = new MutablePropertyValues();

        String path = "";
        flattenChild(path, flat, value);

        return flat;
    }

    private static void flattenChild(String parentPath, MutablePropertyValues target, Object source) {
        if (source != null) {
            if (TypeUtils.isList(source) || TypeUtils.isArray(source)) {
                List iterable;
                if (TypeUtils.isArray(source)) {
                    iterable = Arrays.asList(source);
                } else {
                    iterable = (List) source;
                }

                int index = 0;
                for (Object i : iterable) {
                    String itemPath = String.format("%s[%d]", parentPath, index++);
                    flattenChild(itemPath, target, i);
                }
            } else if (TypeUtils.isPrimitive(source)) {
                target.add(parentPath, source);
            } else {
                List<Field> fields = TypeUtils.getAllFields(source.getClass());

                for (Field field : fields) {
                    field.setAccessible(true);
                    try {
                        String path = String.format("%s%s%s", parentPath, StringUtils.isEmpty(parentPath) ? "" : ".", field.getName());
                        Object fieldValue = PropertyUtils.getProperty(source, field.getName());
                        flattenChild(path, target, fieldValue);
                    } catch (Exception e) {
                        System.out.println(e.getMessage());
                    }
                }
            }
        }
    }

    public static void dump(Object object) {
        try {
            Map<String, String> description = BeanUtils.describe(object);
            System.out.println(description.toString());
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        }
    }
}
