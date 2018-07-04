package applica.framework.data.listening;

import applica.framework.Entity;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class RepositoryEventManager implements RepositoryListener {

    private class ListenerInfo {

        private final Class<? extends Entity> entityType;
        private final RepositoryListener repositoryListener;
        private final int priority;

        public ListenerInfo(Class<? extends Entity> entityType, RepositoryListener repositoryListener, int priority) {
            this.entityType = entityType;
            this.repositoryListener = repositoryListener;
            this.priority = priority;
        }

        public Class<? extends Entity> getEntityType() {
            return entityType;
        }

        public RepositoryListener getRepositoryListener() {
            return repositoryListener;
        }

        public int getPriority() {
            return priority;
        }
    }

    private static RepositoryEventManager repositoryEventManager;

    public static RepositoryEventManager instance() {
        if (repositoryEventManager == null) {
            repositoryEventManager = new RepositoryEventManager();
        }

        return repositoryEventManager;
    }

    private List<ListenerInfo> listeners = new ArrayList<>();

    /**
     * Adds a repository listener. Priority is descending
     * @param entityType
     * @param repositoryListener
     * @param priority
     */
    public <T extends Entity> void addListener(Class<T> entityType, RepositoryListener repositoryListener, int priority) {
        this.listeners.add(new ListenerInfo(entityType, repositoryListener, priority));
        this.listeners.sort(Comparator.comparing(p -> p.priority * -1));
    }

    public <T extends Entity> void addListener(Class<T> entityType, RepositoryListener repositoryListener) {
        addListener(entityType, repositoryListener, 0);
    }

    public void addListener(RepositoryListener repositoryListener) {
        addListener(null, repositoryListener, 0);
    }

    public void addListener(RepositoryListener repositoryListener, int priority) {
        addListener(null, repositoryListener, priority);
    }

    @Override
    public <T extends Entity> void onBeforeSave(RepositoryEvent event, T entity) {
        if (entity != null) {
            listeners
                    .stream()
                    .filter(l -> l.entityType == null || l.entityType.equals(event.getEntityType()))
                    .forEach(l -> l.repositoryListener.onBeforeSave(event, entity));
        }
    }

    @Override
    public <T extends Entity> void onSave(RepositoryEvent event, T entity) {
        if (entity != null) {
            listeners
                    .stream()
                    .filter(l -> l.entityType == null || l.entityType.equals(event.getEntityType()))
                    .forEach(l -> l.repositoryListener.onSave(event, entity));
        }
    }

    @Override
    public void onBeforeDelete(RepositoryEvent event, Object entityId) {
        if (entityId != null) {
            listeners
                    .stream()
                    .filter(l -> l.entityType == null || l.entityType.equals(event.getEntityType()))
                    .forEach(l -> l.repositoryListener.onBeforeDelete(event, entityId));
        }
    }

    @Override
    public void onDelete(RepositoryEvent event, Object entityId) {
        if (entityId != null) {
            listeners
                    .stream()
                    .filter(l -> l.entityType == null || l.entityType.equals(event.getEntityType()))
                    .forEach(l -> l.repositoryListener.onDelete(event, entityId));
        }
    }
}
