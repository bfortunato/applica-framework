package applica.framework.relations;

import applica.framework.Entity;

/**
 * Created by bimbobruno on 03/04/2017.
 */
public class RelationException extends Throwable {

    private final Entity entity;
    private final RelationField relation;

    public RelationException(Entity entity, RelationField relation) {
        this.entity = entity;
        this.relation = relation;
    }

    public Entity getEntity() {
        return entity;
    }

    public RelationField getRelation() {
        return relation;
    }
}
