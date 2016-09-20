package applica.framework.tracking;

import applica.framework.AEntity;
import applica.framework.ChainedCrudStrategy;
import applica.framework.Entity;
import applica.framework.Repository;
import org.springframework.util.Assert;

import java.util.Date;

/**
 * Created by bimbobruno on 23/10/15.
 */
public class TrackingCrudStrategy extends ChainedCrudStrategy {

    @Override
    public <T extends Entity> void save(T entity, Repository<T> repository) {
        Assert.notNull(getParent(), "Parent strategy not setted");

        if (entity == null) {
            return;
        }

        if (TrackedEntity.class.isAssignableFrom(entity.getClass())) {
            if (entity.getId() == null || entity.getId().equals(AEntity.nullId())) {
                ((TrackedEntity) entity).setCreationDate(new Date());
            } else {
                ((TrackedEntity) entity).setLastUpdate(new Date());
            }
        }

        super.save(entity, repository);
    }
}
