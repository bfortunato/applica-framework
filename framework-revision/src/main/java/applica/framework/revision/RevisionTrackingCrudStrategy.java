package applica.framework.revision;

import applica.framework.*;
import applica.framework.revision.model.Revision;
import applica.framework.revision.services.RevisionService;
import applica.framework.security.Security;
import applica.framework.security.User;
import applica.framework.widgets.entities.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class RevisionTrackingCrudStrategy extends ChainedCrudStrategy {

    @Autowired
    private RevisionService entityRevisionService;

    @Override
    public <T extends Entity> void saveAll(List<T> entities, Repository<T> repository) {

        boolean revisionEnabled = entityRevisionService.isRevisionEnabled(EntityUtils.getEntityIdAnnotation(repository.getEntityType()));

        List<T> toInsert = null;

        List<T> toEdit = null;

        List<T> toEditPrevious;

        if (revisionEnabled) {
            toInsert = entities.stream().filter(e -> e.getId() == null).collect(Collectors.toList());
            toEdit = entities.stream().filter(e -> e.getId() != null).collect(Collectors.toList());
            toEditPrevious = repository.getMultiple(toEdit.stream().map(t -> t.getId()).collect(Collectors.toList()));
        } else {
            toEditPrevious = null;
        }


        super.saveAll(entities, repository);

        if (revisionEnabled) {
            List revisions = new ArrayList<>();
            User user = Security.withMe().getLoggedUser();
            revisions.addAll(toInsert.stream().map(t -> entityRevisionService.createRevision(user, t, null)).collect(Collectors.toList()));
            revisions.addAll(toEdit.stream().map(t -> entityRevisionService.createRevision(user, t, toEditPrevious.stream().filter(previous -> Objects.equals(previous.getId(), t.getId())).findFirst().orElse(null))).collect(Collectors.toList()));

            Runnable runnable = () -> Repo.of(entityRevisionService.getRevisionClass()).saveAll(revisions);
            executeRevisionAction(runnable);
           ;
        }



    }

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
        String entityName = EntityUtils.getEntityIdAnnotation(repository.getEntityType());
        boolean revisionEnabled = entityRevisionService.isRevisionEnabled(entityName);
        List<Entity> previous = revisionEnabled ? (List<Entity>) repository.find(query).getRows() : new ArrayList<>();
        super.deleteMany(query, repository);
        if (previous.size() > 0 && revisionEnabled) {
            User user = Security.withMe().getLoggedUser();
            Runnable runnable = () -> {
                List revisions = previous.stream().map(p -> entityRevisionService.createRevision(user, null, p)).filter(r -> r.canSave()).collect(Collectors.toList());
                Repo.of(entityRevisionService.getRevisionClass()).saveAll(revisions);
            };
            executeRevisionAction(runnable);
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

    public void executeRevisionAction(Runnable runnable) {
        if (entityRevisionService.executeRevisionInOtherThread()) {
            new Thread(runnable).start();
        } else {
            runnable.run();
        }
    }
}
