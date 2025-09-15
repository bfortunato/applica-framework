package applica.framework.revision.services;

import applica.framework.Entity;
import applica.framework.revision.model.Revision;
import applica.framework.revision.model.RevisionSettings;
import applica.framework.security.User;

import java.util.List;

public interface RevisionService {

    boolean isRevisionEnabled(String entity);

    Revision createAndSaveRevision(User user, Entity entity, Entity previousEntity);

    Class<? extends Revision> getRevisionClass();

    Revision createRevision(User user, Entity entity, Entity previousEntity);

    List<Revision> getRevisionsForEntity(Entity entity);

    long getLastCodeForEntityRevision(String entityId, Class<? extends Entity> entity);

    void enableRevisionForCurrentThread();

    void isRevisionEnabledOnCurrentThread();

    void disableRevisionForCurrentThread();

    boolean executeRevisionInOtherThread();
}
