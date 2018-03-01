package applica.framework.data.listening;

import applica.framework.Entity;

public interface RepositoryListener {

    <T extends Entity> void onBeforeSave(RepositoryEvent event, T entity);
    <T extends Entity> void onSave(RepositoryEvent event, T entity);
    void onBeforeDelete(RepositoryEvent event, Object entityId);
    void onDelete(RepositoryEvent event, Object entityId);

}
