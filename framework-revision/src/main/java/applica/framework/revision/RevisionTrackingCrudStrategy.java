package applica.framework.revision;

import applica.framework.*;
import applica.framework.revision.services.RevisionService;
import applica.framework.security.Security;
import applica.framework.security.User;
import applica.framework.widgets.entities.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

import java.util.List;

public class RevisionTrackingCrudStrategy extends ChainedCrudStrategy {

    @Autowired
    private RevisionService entityRevisionService;


    @Override
    public <T extends Entity> void save(T entity, Repository<T> repository) {
        Assert.notNull(getParent(), "Parent strategy not setted");

        if (entity == null) {
            return;
        }

        boolean revisionEnabled = entityRevisionService.isRevisionEnabled(EntityUtils.getEntityIdAnnotation(entity.getClass()));


        boolean creation = entity.getId() == null;
        Entity previousEntity = null;
        if (revisionEnabled)
            previousEntity = !creation ? repository.get(entity.getId()).get() : null;

        super.save(entity, repository);

        if (revisionEnabled) {
            User user = Security.withMe().getLoggedUser();
            Entity finalPreviousEntity = previousEntity;
            Runnable runnable = () -> entityRevisionService.createAndSaveRevision(user, entity, finalPreviousEntity);
            executeRevisionAction(runnable);
        }

    }

    @Override
    public <T extends Entity> void deleteMany(Query query, Repository<T> repository) {
        List<Entity> previous = (List<Entity>) repository.find(query).getRows();
        super.deleteMany(query, repository);
        if (previous.size() > 0) {
            String entityName = EntityUtils.getEntityIdAnnotation(previous.get(0).getClass());
            if (entityRevisionService.isRevisionEnabled(entityName)) {
                User user = Security.withMe().getLoggedUser();
                previous.forEach(p -> {
                    Runnable runnable = () -> entityRevisionService.createAndSaveRevision(user, null, p);
                    executeRevisionAction(runnable);
                });

            }
        }
    }

    @Override
    public <T extends Entity> void delete(Object id, Repository<T> repository) {
        Entity previousEntity = repository.get(id).get();
        super.delete(id, repository);
        String entityName = EntityUtils.getEntityIdAnnotation(previousEntity.getClass());
        if (entityRevisionService.isRevisionEnabled(entityName)) {
            User user = Security.withMe().getLoggedUser();
            Runnable runnable = () -> entityRevisionService.createAndSaveRevision(user, null, previousEntity);
            executeRevisionAction(runnable);
        }
    }

    private void executeRevisionAction(Runnable runnable) {
        if (entityRevisionService.executeRevisionInOtherThread()) {
            new Thread(runnable).start();
        } else {
            runnable.run();
        }
    }
}