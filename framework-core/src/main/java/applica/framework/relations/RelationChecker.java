package applica.framework.relations;

import applica.framework.Entity;
import applica.framework.Repo;
import org.apache.commons.beanutils.PropertyUtils;

import java.lang.reflect.InvocationTargetException;
import java.util.List;

/**
 * Created by bimbobruno on 03/04/2017.
 */
public class RelationChecker {

    /**
     * This method check relation of child fields in specified entity. For example, if entity contains a related field,
     * this check if the field is consistent with database.
     * Usually used in entity save method
     * @param entity
     */
    public void checkForSave(Entity entity) throws RelationException {
        List<RelationField> relationFields = RelationsRegistry.instance().getEntityRelations(entity.getClass());

        for (RelationField relation : relationFields) {
            try {
                Object value = PropertyUtils.getProperty(entity, relation.getFieldName());
                switch (relation.getRelationType()) {
                    case ID:
                        checkIdForSave(entity, relation, value);
                        break;
                    case ENTITY:
                        checkEntityForSave(entity, relation, value);
                        break;
                    case LIST_OF_IDS:
                        checkListOfIdsForSave(entity, relation, value);
                        break;
                    case LIST_OF_ENTITIES:
                        checkListOfEntitiesForSave(entity, relation, value);
                        break;
                }
            } catch (IllegalAccessException e) {
                throw new RuntimeException(e);
            } catch (InvocationTargetException e) {
                throw new RuntimeException(e);
            } catch (NoSuchMethodException e) {
                throw new RuntimeException(e);
            }
        }
    }

    private void checkListOfEntitiesForSave(Entity entity, RelationField relation, Object value) throws RelationException {
        List relatedEntities = (List) value;
        for (Object relatedEntity : relatedEntities) {
            checkIdForSave(entity, relation, ((Entity) relatedEntity).getId());
        }
    }

    private void checkListOfIdsForSave(Entity entity, RelationField relation, Object value) throws RelationException {
        List ids = (List) value;
        for (Object id : ids) {
            checkIdForSave(entity, relation, id);
        }
    }

    private void checkEntityForSave(Entity entity, RelationField relation, Object value) throws RelationException {
        Object relatedId = ((Entity) value).getId();
        Entity relatedEntity = Repo.of(relation.getRelationClass()).get(relatedId).orElse(null);
        if (relatedEntity == null) {
            throw new RelationException(entity, relation);
        }
    }

    private void checkIdForSave(Entity entity, RelationField relation, Object value) throws RelationException {
        Object relatedId = value;
        Entity relatedEntity = Repo.of(relation.getRelationClass()).get(relatedId).orElse(null);
        if (relatedEntity == null) {
            throw new RelationException(entity, relation);
        }
    }

    /**
     * This method check if specified entity is used as a relation in other entities
     * Usually used in entity delete method
     * @param entity
     */
    public void checkForDeletion(Entity entity) throws RelationException {
        List<RelationField> relationFields = RelationsRegistry.instance().getAllRelationsByEntityType(entity.getClass());

        for (RelationField relation : relationFields) {
            try {
                Object value = PropertyUtils.getProperty(entity, relation.getFieldName());
                switch (relation.getRelationType()) {
                    case ID:
                        checkIdForDelete(entity, relation, value);
                        break;
                    case ENTITY:
                        checkEntityForDelete(entity, relation, value);
                        break;
                    case LIST_OF_IDS:
                        checkListOfIdsForDelete(entity, relation, value);
                        break;
                    case LIST_OF_ENTITIES:
                        checkListOfEntitiesForDelete(entity, relation, value);
                        break;
                }
            } catch (IllegalAccessException e) {
                throw new RuntimeException(e);
            } catch (InvocationTargetException e) {
                throw new RuntimeException(e);
            } catch (NoSuchMethodException e) {
                throw new RuntimeException(e);
            }
        }
    }

    private void checkListOfEntitiesForDelete(Entity entity, RelationField relation, Object value) throws RelationException {
        List relatedEntities = (List) value;
        for (Object relatedEntity : relatedEntities) {
            checkIdForDelete(entity, relation, ((Entity) relatedEntity).getId());
        }
    }

    private void checkListOfIdsForDelete(Entity entity, RelationField relation, Object value) throws RelationException {
        List ids = (List) value;
        for (Object id : ids) {
            checkIdForDelete(entity, relation, id);
        }
    }

    private void checkEntityForDelete(Entity entity, RelationField relation, Object value) throws RelationException {
        Object relatedId = ((Entity) value).getId();
        Entity relatedEntity = Repo.of(relation.getRelationClass()).get(relatedId).orElse(null);
        if (relatedEntity != null) {
            throw new RelationException(entity, relation);
        }
    }

    private void checkIdForDelete(Entity entity, RelationField relation, Object value) throws RelationException {
        Object relatedId = value;
        Entity relatedEntity = Repo.of(relation.getRelationClass()).get(relatedId).orElse(null);
        if (relatedEntity != null) {
            throw new RelationException(entity, relation);
        }
    }

}
