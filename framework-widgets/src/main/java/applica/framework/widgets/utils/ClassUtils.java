package applica.framework.widgets.utils;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
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

    public static Object invokeMethodOnObjectWithCatchOptions(Object entity, String method, boolean catchException, Object... params) throws Exception {
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
            if (catchException)
                e.printStackTrace();
            else
                throw e;

        }
        return null;
    }

    public static Object invokeMethodOnObject(Object entity, String method, Object... params) {

        try {
            return invokeMethodOnObjectWithCatchOptions(entity, method, true, params);
        } catch (Exception e) {
            return null;
        }
    }


}
