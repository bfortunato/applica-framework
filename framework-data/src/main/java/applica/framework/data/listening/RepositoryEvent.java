package applica.framework.data.listening;

import applica.framework.Entity;

public class RepositoryEvent {

    private final Type eventType;
    private boolean stopped = false;
    private Class<? extends Entity> entityType;

    public RepositoryEvent(Type eventType, Class<? extends Entity> entityType) {
        this.eventType = eventType;
        this.entityType = entityType;
    }

    public enum Type {
        BeforeSave,
        Save,
        BeforeDelete,
        Delete
    }

    public Type getEventType() {
        return eventType;
    }

    public Class<? extends Entity> getEntityType() {
        return entityType;
    }

    public void stop() {
        this.stopped = true;
    }

    public boolean isStopped() {
        return stopped;
    }
}
