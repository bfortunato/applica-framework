package applica.framework.data.mongodb;

import applica.framework.Entity;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class MappingContext {

    class CacheItem {
        private Class<? extends Entity> entityType;
        private Object id;
        private Entity entity;
    }

    private List<CacheItem> cache = new ArrayList<>();

    private int nestedIgnoredReferenceCounter = 0;
    private boolean alwaysIgnoreNestedReferences;

    public void pushIgnoreNestedReferences() {
        nestedIgnoredReferenceCounter++;
    }

    public void popIgnoreNestedReferences() {
        if (nestedIgnoredReferenceCounter == 0) {
            throw new RuntimeException("nested ignored references counter cannot be negative");
        }

        nestedIgnoredReferenceCounter--;
    }

    public boolean isIgnoringNestedReferences() {
        return nestedIgnoredReferenceCounter > 0 || alwaysIgnoreNestedReferences;
    }

    public void setAlwaysIgnoreNestedReferences(boolean alwaysIgnoreNestedReferences) {
        this.alwaysIgnoreNestedReferences = alwaysIgnoreNestedReferences;
    }

    public Entity getCached(Class<? extends Entity> entityType, Object id) {
        return cache.stream().filter(c -> Objects.equals(entityType, c.entityType) && Objects.equals(id, c.id)).findFirst().map(c -> c.entity).orElse(null);
    }

    public void putInCache(Entity entity) {
        if (entity == null) {
            return;
        }

        var item = new CacheItem();
        item.entity = entity;
        item.entityType = entity.getClass();
        item.id = entity.getId();

        cache.add(item);
    }
}
