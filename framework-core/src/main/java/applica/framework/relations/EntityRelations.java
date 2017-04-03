package applica.framework.relations;

import applica.framework.Entity;
import org.apache.commons.beanutils.PropertyUtils;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by bimbobruno on 03/04/2017.
 */
public class EntityRelations {

    private Class<? extends Entity> entityType;
    private List<RelationField> relations = new ArrayList<>();

    public EntityRelations(Class<? extends Entity> entityType) {
        this.entityType = entityType;
    }

    public Class<? extends Entity> getEntityType() {
        return entityType;
    }

    public void setEntityType(Class<? extends Entity> entityType) {
        this.entityType = entityType;
    }

    public List<RelationField> getRelations() {
        return relations;
    }

    public void setRelations(List<RelationField> relations) {
        this.relations = relations;
    }
}
