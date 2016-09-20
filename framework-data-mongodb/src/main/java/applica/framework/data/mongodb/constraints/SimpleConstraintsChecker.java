package applica.framework.data.mongodb.constraints;

import applica.framework.Entity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 30/10/14
 * Time: 11:42
 */
public class SimpleConstraintsChecker implements ConstraintsChecker {

    @Autowired
    private ApplicationContext applicationContext;

    private List<Constraint> constraints;
    private List<ReferencedConstraint> referencedConstraints;

    private List<Constraint> loadConstraints(Class<? extends Entity> type) {
        if (constraints == null) {
            constraints = new ArrayList<Constraint>(applicationContext.getBeansOfType(Constraint.class).values());
        }

        return constraints.stream().filter(c -> c.getType().equals(type)).collect(Collectors.toList());
    }

    private List<ReferencedConstraint> loadPrimaryConstraints(Class<? extends Entity> type) {
        if (referencedConstraints == null) {
            referencedConstraints = new ArrayList<ReferencedConstraint>(applicationContext.getBeansOfType(ReferencedConstraint.class).values());
        }

        return referencedConstraints.stream().filter(c -> c.getPrimaryType().equals(type)).collect(Collectors.toList());
    }

    private List<ReferencedConstraint> loadForeignConstraints(Class<? extends Entity> type) {
        if (referencedConstraints == null) {
            referencedConstraints = new ArrayList<ReferencedConstraint>(applicationContext.getBeansOfType(ReferencedConstraint.class).values());
        }

        return referencedConstraints.stream().filter(c -> c.getForeignType().equals(type)).collect(Collectors.toList());
    }

    @Override
    public void check(Entity entity) {
        Objects.requireNonNull(entity, "Entity cannot be null");
        loadConstraints(entity.getClass()).forEach(c -> c.check(entity));
    }

    @Override
    public void checkPrimary(Entity entity) {
        Objects.requireNonNull(entity, "Entity cannot be null");
        loadPrimaryConstraints(entity.getClass()).forEach(c -> c.checkPrimary(entity));
    }

    @Override
    public void checkForeign(Entity entity) {
        Objects.requireNonNull(entity, "Entity cannot be null");
        loadForeignConstraints(entity.getClass()).forEach(c -> c.checkForeign(entity));
    }
}
