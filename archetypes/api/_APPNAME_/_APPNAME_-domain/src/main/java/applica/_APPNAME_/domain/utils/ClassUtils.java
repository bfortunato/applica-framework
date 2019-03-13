package applica._APPNAME_.domain.utils;

import applica._APPNAME_.domain.model.Filters;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.type.filter.AssignableTypeFilter;

import java.util.Set;

public class ClassUtils {

    public interface ClassUtilsRunnable {
        void perform(Class component);
    }



    public static void performForAllSubclassesInModel(Class father, ClassUtilsRunnable runnable) {
        ClassPathScanningCandidateComponentProvider provider = new ClassPathScanningCandidateComponentProvider(false);
        provider.addIncludeFilter(new AssignableTypeFilter(father));

        Set<BeanDefinition> components = provider.findCandidateComponents(Filters.class.getPackage().getName());
        for (BeanDefinition component : components)
        {
            Class cls = null;
            try {
                cls = Class.forName(component.getBeanClassName());
                // use class cls found
                runnable.perform(cls);
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
            }

        }
    }


}
