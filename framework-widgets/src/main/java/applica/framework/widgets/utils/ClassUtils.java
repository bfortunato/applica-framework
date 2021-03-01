package applica.framework.widgets.utils;

import java.lang.reflect.Field;
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

//    public static void performForAllSubclassesInModel(Class father, ClassUtilsRunnable runnable) {
//        ClassPathScanningCandidateComponentProvider provider = new ClassPathScanningCandidateComponentProvider(false);
//        provider.addIncludeFilter(new AssignableTypeFilter(father));
//
//        Set<BeanDefinition> components = provider.findCandidateComponents(Filters.class.getPackage().getName());
//        for (BeanDefinition component : components)
//        {
//            Class cls = null;
//            try {
//                cls = Class.forName(component.getBeanClassName());
//                // use class cls found
//                runnable.perform(cls);
//            } catch (ClassNotFoundException e) {
//                e.printStackTrace();
//            }
//
//        }
//    }


}
