package applica.framework.relations;

import applica.framework.EntitiesScanner;
import applica.framework.Entity;
import applica.framework.annotations.Relation;
import applica.framework.utils.TypeUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.lang.reflect.Field;
import java.lang.reflect.ParameterizedType;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by bimbobruno on 03/04/2017.
 */
public class RelationsRegistry implements EntitiesScanner.ScanHandler {

    private static RelationsRegistry s_instance;

    public static RelationsRegistry instance() {
        if (s_instance == null) {
             s_instance = new RelationsRegistry();
        }

        return s_instance;
    }

    private Log logger = LogFactory.getLog(getClass());
    private final List<EntityRelations> entityRelations = new ArrayList<>();

    private RelationsRegistry() {}

    @Override
    public void handle(Class<? extends Entity> entityType) {
        //not found in cache, create a new one
        EntityRelations relations = new EntityRelations(entityType);

        logger.info(String.format("Scanning class %s for relations...", entityType.getName()));

        List<Field> fields = TypeUtils.getAllFields(entityType);
        for (Field field : fields) {
            Relation relation = field.getAnnotation(Relation.class);
            if (relation != null) {
                RelationField.Type type;
                if (TypeUtils.isEntity(field.getType())) {
                    type = RelationField.Type.ENTITY;
                    handle((Class<? extends Entity>) field.getType());
                } else if (TypeUtils.isListOfEntities(field.getGenericType())) {
                    type = RelationField.Type.LIST_OF_ENTITIES;
                    handle((Class<? extends Entity>) TypeUtils.getFirstGenericArgumentType((ParameterizedType) field.getGenericType()));
                } else if (TypeUtils.isList(field.getType())) {
                    type = RelationField.Type.LIST_OF_IDS;
                } else {
                    type = RelationField.Type.ID;
                }

                RelationField relationField = new RelationField(field.getName(), type, relation.value());
                relations.getRelations().add(relationField);

                logger.info(String.format("Relation field added: %s", relationField.toString()));
            }
        }

        entityRelations.add(relations);
    }

    public List<RelationField> getAllRelationsByEntityType(Class<? extends Entity> entityType) {
        List<RelationField> relationFields = new ArrayList<>();
        for (EntityRelations entityRelations : entityRelations) {
            if (!entityRelations.getEntityType().equals(entityType)) {
                entityRelations.getRelations().stream().filter(r -> r.getRelationClass().equals(entityType)).forEach(relationFields::add);
            }
        }
        return relationFields;
    }

    public List<RelationField> getEntityRelations(Class<? extends Entity> entityType) {
        List<RelationField> relationFields = new ArrayList<>();
        entityRelations
                .stream()
                .filter(e -> e.getEntityType().equals(entityType))
                .findFirst()
                .ifPresent(e -> relationFields.addAll(e.getRelations()));

        return relationFields;
    }
}
