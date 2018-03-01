package applica.framework.data.listening;

import applica.framework.Entity;

public class RepositoryListenerAdapter implements RepositoryListener {

    @Override
    public <T extends Entity> void onBeforeSave(RepositoryEvent event, T entity) {

    }

    @Override
    public <T extends Entity> void onSave(RepositoryEvent event, T entity) {

    }

    @Override
    public void onBeforeDelete(RepositoryEvent event, Object entityId) {

    }

    @Override
    public void onDelete(RepositoryEvent event, Object entityId) {

    }
}
