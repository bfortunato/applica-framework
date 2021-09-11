package applica.framework.widgets.utils;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

public class ClassUtils {


    public static List<Field> getAllFields(Class<? extends Object> type) {
        ArrayList fields = new ArrayList();
        for(Class c = type; c != null; c = c.getSuperclass()) {
            for (Field declaredField : c.getDeclaredFields()) {
                declaredField.setAccessible(true);
                fields.add(declaredField);
            }
        }

        return fields;
    }

    public static Object invokeMethodOnObject(Object entity, String method, Object... params) {
        try {

            for (Method declaredMethod : entity.getClass().getMethods()) {
                if (declaredMethod.getName().equals(method)) {
                    Object r = declaredMethod.invoke(entity, params);
                    if (r != null)
                        return r;
                    break;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();

        }
        return null;
    }


}
