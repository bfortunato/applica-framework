package applica.framework.data.listening;

import applica.framework.AEntity;
import applica.framework.ChainedCrudStrategy;
import applica.framework.Entity;
import applica.framework.Repository;
import org.springframework.util.Assert;

import java.util.Date;

/**
 * Created by bimbobruno on 23/10/15.
 */
public class ListenerCrudStrategy extends ChainedCrudStrategy {

    @Override
    public <T extends Entity> void save(T entity, Repository<T> repository) {
        Assert.notNull(getParent(), "Parent strategy not setted");

        RepositoryEventManager.instance().onBeforeSave(new RepositoryEvent(RepositoryEvent.Type.BeforeSave, repository.getEntityType()), entity);

        super.save(entity, repository);

        RepositoryEventManager.instance().onSave(new RepositoryEvent(RepositoryEvent.Type.Save, repository.getEntityType()), entity);
    }

    @Override
    public <T extends Entity> void delete(Object id, Repository<T> repository) {
        Assert.notNull(getParent(), "Parent strategy not setted");

        RepositoryEventManager.instance().onBeforeDelete(new RepositoryEvent(RepositoryEvent.Type.BeforeSave, repository.getEntityType()), id);

        super.delete(id, repository);

        RepositoryEventManager.instance().onDelete(new RepositoryEvent(RepositoryEvent.Type.BeforeSave, repository.getEntityType()), id);
    }
}
