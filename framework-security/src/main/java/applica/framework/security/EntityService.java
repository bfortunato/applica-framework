package applica.framework.security;

import applica.framework.Entity;
import java.util.List;

public interface EntityService {
    /**
     * Controlla l'univocità del campo fieldname con il valore fieldValue per l'entity di classe entityClass
     * @param entityClass
     * @param fieldName
     * @param fieldValue
     * @param entity
     * @return
     */
    boolean isUnique(Class<? extends Entity> entityClass, String fieldName, Object fieldValue, Entity entity);


    void materializePropertyFromId(List<Entity> rows, String idProperty, String entityProperty, Class entityClass);
}
