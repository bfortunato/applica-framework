package applica.framework.revision;

import applica.framework.ChainedCrudStrategy;
import applica.framework.Entity;
import applica.framework.Repository;
import applica.framework.library.options.OptionsManager;
import applica.framework.revision.services.RevisionService;
import applica.framework.widgets.entities.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

public class RevisionTrackingCrudStrategy extends ChainedCrudStrategy {

    @Autowired
    private RevisionService entityRevisionService;



    @Override
    public <T extends Entity> void save(T entity, Repository<T> repository) {
        Assert.notNull(getParent(), "Parent strategy not setted");

        if (entity == null) {
            return;
        }


        boolean creation = entity.getId() == null;
        Entity previousEntity = !creation? repository.get(entity.getId()).get() : null;

        super.save(entity, repository);

        Runnable runnable = () -> {
            try {
                if (entityRevisionService.isRevisionEnabled(EntityUtils.getEntityIdAnnotation(entity.getClass()))) {
                    entityRevisionService.createAndSaveRevision(entity, previousEntity);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }

        };
        executeRevisionAction(runnable);
    }

    @Override
    public <T extends Entity> void delete(Object id, Repository<T> repository) {
        Entity previousEntity = repository.get(id).get();
        super.delete(id, repository);

        Runnable runnable = () -> {
            try {
                String entityName = EntityUtils.getEntityIdAnnotation(previousEntity.getClass());
                if (entityRevisionService.isRevisionEnabled(entityName)) {
                    entityRevisionService.createRevision(null, previousEntity);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        };

        executeRevisionAction(runnable);



    }

    private void executeRevisionAction(Runnable runnable) {
        if (entityRevisionService.executeRevisionInOtherThread()) {
            new Thread(runnable).start();
        } else {
            runnable.run();
        }
    }
}