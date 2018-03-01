package applica.framework.indexing.listeners;

import applica.framework.Entity;
import applica.framework.data.listening.RepositoryEvent;
import applica.framework.data.listening.RepositoryListenerAdapter;
import applica.framework.indexing.services.IndexService;
import org.springframework.beans.factory.annotation.Autowired;

public class IndexingRepositoryListener extends RepositoryListenerAdapter {

    @Autowired
    private IndexService indexService;

    @Override
    public <T extends Entity> void onSave(RepositoryEvent event, T entity) {
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
