package applica.framework.widgets.entities;

import applica.framework.Entity;

public class EntityUtils {

    public static String getEntityIdAnnotation(Class<? extends Entity> entityClass) {
        return entityClass != null && entityClass.getAnnotation(EntityId.class) != null ? entityClass.getAnnotation(EntityId.class).value() : null;
    }

    public static boolean isNew(Entity entity) {
        return entity.getId() == null;
    }
}
