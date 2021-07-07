package applica.framework;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.type.filter.AnnotationTypeFilter;
import org.springframework.core.type.filter.AssignableTypeFilter;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by bimbobruno on 03/04/2017.
 */
public class EntitiesScanner {

    public interface ScanHandler {
        void handle(Class<? extends Entity> entityType);
    }

    private Log logger = LogFactory.getLog(getClass());
    private List<ScanHandler> scanHandlers = new ArrayList<>();

    public void addHandler(ScanHandler handler) {
        scanHandlers.add(handler);
    }

    public void scan(Package... packages) {
        logger.info("Scanning packages for entities...");

        ClassPathScanningCandidateComponentProvider scanner = new ClassPathScanningCandidateComponentProvider(false);
        scanner.addIncludeFilter(new AssignableTypeFilter(Entity.class));

        List<Class<?>> types = new ArrayList<>();
        for (Package myPackage : packages) {
            logger.info(" ********** Scanning package " + myPackage.getName() + " **********");
            for (BeanDefinition bean : scanner.findCandidateComponents(myPackage.getName())) {
                logger.info("Bean definition found " + bean.getBeanClassName());
                try {
                    Class<?> type = Class.forName(bean.getBeanClassName());
                    types.add(type);
                } catch (ClassNotFoundException e) {
                    logger.error("Error loading class type for bean definition");
                    e.printStackTrace();
                }
            }
        }

        for (Class<?> type : types) {
            scanHandlers.forEach(scanHandler -> scanHandler.handle((Class<? extends Entity>) type));
        }
    }

}
