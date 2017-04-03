package applica.framework.relations;

import applica.framework.Entity;

/**
 * Created by bimbobruno on 03/04/2017.
 */
public class RelationField {

    public enum Type {
        ID,
        ENTITY,
        LIST_OF_IDS,
        LIST_OF_ENTITIES;

    }
    private String fieldName;
    private Type relationType;
    private Class<? extends Entity> relationClass;

    public RelationField(String fieldName, Type relationType, Class<? extends Entity> relationClass) {
        this.fieldName = fieldName;
        this.relationType = relationType;
        this.relationClass = relationClass;
    }

    public String getFieldName() {
        return fieldName;
    }

    public Type getRelationType() {
        return relationType;
    }

    public Class<? extends Entity> getRelationClass() {
        return relationClass;
    }

    @Override
    public String toString() {
        return String.format("%s -> %s (%s)", fieldName, relationClass.getName(), relationType);
    }
}
