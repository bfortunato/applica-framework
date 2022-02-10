package applica.framework.data.constraints;

import applica.framework.Entity;
import applica.framework.data.constraints.annotations.AnnotadedConstraintsRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class DefaultConstraintsChecker implements ConstraintsChecker {


    @Autowired
    private ApplicationContext applicationContext;

    private List<Constraint> constraints;
    private List<DeleteConstraint> deleteConstraints;
    private List<ReferencedConstraint> referencedConstraints;

    private List<Constraint> loadConstraints(Class<? extends Entity> type) {
        if (constraints == null) {
            constraints = new ArrayList<Constraint>(applicationContext.getBeansOfType(Constraint.class).values());
        }

        return constraints.stream().filter(c -> c.getType().equals(type)).collect(Collectors.toList());
    }

    private List<DeleteConstraint> loadDeleteConstraints(Class<? extends Entity> type) {
        if (deleteConstraints == null) {
            deleteConstraints = new ArrayList<DeleteConstraint>(applicationContext.getBeansOfType(DeleteConstraint.class).values());
        }

        return deleteConstraints.stream().filter(c -> c.getType().equals(type)).collect(Collectors.toList());
    }

    private List<ReferencedConstraint> loadPrimaryConstraints(Class<? extends Entity> type) {
        if (referencedConstraints == null) {
            referencedConstraints = new ArrayList<ReferencedConstraint>(applicationContext.getBeansOfType(ReferencedConstraint.class).values());
        }

        return referencedConstraints.stream().filter(c -> c.getPrimaryType().equals(type)).collect(Collectors.toList());
    }

    @Override
    public void check(Entity entity) {
        Objects.requireNonNull(entity, "Entity cannot be null");
        loadConstraints(entity.getClass()).forEach(c -> c.check(entity));
        AnnotadedConstraintsRegistry.instance().getAnnotadedUniqueConstraints(entity.getClass()).forEach(c -> c.check(entity));
    }

    @Override
    public void checkPrimary(Entity entity) {
        Objects.requireNonNull(entity, "Entity cannot be null");
        loadPrimaryConstraints(entity.getClass()).forEach(c -> c.check(entity));
        AnnotadedConstraintsRegistry.instance().getAnnotatedForeignConstraints(entity.getClass()).forEach(c -> c.check(entity));
    }

    @Override
    public void checkDelete(Entity entity) {
        Objects.requireNonNull(entity, "Entity cannot be null");
        loadDeleteConstraints(entity.getClass()).forEach(c -> c.check(entity));
    }
}
