package applica.framework.indexing.listeners;

import applica.framework.Entity;
import applica.framework.data.listening.RepositoryEvent;
import applica.framework.data.listening.RepositoryListenerAdapter;
import applica.framework.indexing.services.IndexService;
import org.springframework.beans.factory.annotation.Autowired;

public class IndexingRepositoryListener<T extends Entity> extends RepositoryListenerAdapter<T> {

    @Autowired
    private IndexService indexService;

    @Override
    public void onSave(RepositoryEvent event, Entity entity) {
        if (entity != null) {
            indexService.index(entity);
        }
    }

    @Override
    public void onDelete(RepositoryEvent event, Object entityId) {
        if (entityId != null) {
            indexService.remove(String.valueOf(entityId));
        }
    }
}
