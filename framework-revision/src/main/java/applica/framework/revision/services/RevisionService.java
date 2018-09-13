package applica.framework.revision.services;

import applica.framework.Entity;
import applica.framework.revision.model.Revision;
import applica.framework.revision.model.RevisionSettings;

import java.util.List;

public interface RevisionService {
    RevisionSettings getCurrentSettings();

    boolean isRevisionEnabled(String entity);

    Revision createAndSaveRevision(Entity entity, Entity previousEntity);

    Revision createRevision(Entity entity, Entity previousEntity);

    List<Revision> getRevisionsForEntity(Entity entity);

    void enableRevisionForCurrentThread();

    void disableRevisionForCurrentThread();

    boolean executeRevisionInOtherThread();
}
