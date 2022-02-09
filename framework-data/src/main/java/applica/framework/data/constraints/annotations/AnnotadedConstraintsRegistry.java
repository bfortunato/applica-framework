package applica.framework.data.constraints.annotations;

import applica.framework.EntitiesScanner;
import applica.framework.Entity;
import applica.framework.data.constraints.BaseForeignKeyConstraint;
import applica.framework.data.constraints.BaseUniqueConstraint;
import applica.framework.library.utils.TypeUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.util.ArrayList;
import java.util.List;

public class AnnotadedConstraintsRegistry implements EntitiesScanner.ScanHandler {

    private static AnnotadedConstraintsRegistry s_instance;

    public static AnnotadedConstraintsRegistry instance() {
        if (s_instance == null) {
            s_instance = new AnnotadedConstraintsRegistry();
        }

        return s_instance;
    }

    private Log logger = LogFactory.getLog(getClass());

    private List<BaseForeignKeyConstraint> annotatedForeignConstraints = new ArrayList<>();
    private List<BaseUniqueConstraint> annotadedUniqueConstraints = new ArrayList<>();

    private AnnotadedConstraintsRegistry() {

    }

    @Override
    public void handle(Class<? extends Entity> entityType) {
        TypeUtils.getAllFields(entityType).forEach(field -> {
            var foreignKey = field.getAnnotation(ForeignKey.class);
            if (foreignKey != null) {
                annotatedForeignConstraints.add(new BaseForeignKeyConstraint<>(foreignKey.primaryType(), entityType, field.getName()));

                logger.info("Added foreign constraint check: " + foreignKey);
            }

            var uniqueKey = field.getAnnotation(Unique.class);
            if (uniqueKey != null) {
                annotadedUniqueConstraints.add(new BaseUniqueConstraint(entityType, field.getName()));

                logger.info("Added unique constraint check: " + uniqueKey);
            }
        });
    }

    public List<BaseForeignKeyConstraint> getAnnotatedForeignConstraints(Class<? extends Entity> aClass) {
        return annotatedForeignConstraints.stream().filter(a -> a.getPrimaryType().equals(aClass)).toList();
    }

    public List<BaseUniqueConstraint> getAnnotadedUniqueConstraints(Class<? extends Entity> aClass) {
        return annotadedUniqueConstraints.stream().filter(a -> a.getType().equals(aClass)).toList();
    }
}
