package applica.framework.data.listening;

import applica.framework.Entity;

public class RepositoryListenerAdapter<T extends Entity> implements RepositoryListener {
    @Override
    public void onBeforeSave(RepositoryEvent event, Entity entity) {

    }

    @Override
    public void onSave(RepositoryEvent event, Entity entity) {

    }

    @Override
    public void onBeforeDelete(RepositoryEvent event, Object entityId) {

    }

    @Override
    public void onDelete(RepositoryEvent event, Object entityId) {

    }
}
