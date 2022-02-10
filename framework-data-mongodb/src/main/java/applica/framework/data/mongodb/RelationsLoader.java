package applica.framework.data.mongodb;

import applica.framework.Entity;
import applica.framework.Persistable;
import applica.framework.Repository;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static applica.framework.builders.QueryExpressions.in;

public class RelationsLoader {

    private Log logger = LogFactory.getLog(getClass());



    public enum RelationType {
        MANY_TO_ONE,
        MANY_TO_MANY
    }

    private record Relation(RelationType relationType, Persistable destination, Field field, Object sourceValue, Repository<? extends Entity> repository) {}

    private List<Relation> relations;

    public RelationsLoader() {
    }

    public void addManyToOne(Persistable destination, Field field, String id, Repository<? extends Entity> repository) {
        if (relations == null) {
            relations = new ArrayList<>();
        }

        var relation = new Relation(RelationType.MANY_TO_ONE, destination, field, id, repository);
        relations.add(relation);

        logger.debug("New n*1 relation added for in loading list: " + relation);
    }

    public void addManyToMany(Persistable destination, Field field, List<?> sourceList, Repository repository) {
        if (relations == null) {
            relations = new ArrayList<>();
        }

        var relation = new Relation(RelationType.MANY_TO_MANY, destination, field, sourceList, repository);
        relations.add(relation);

        logger.debug("New n*m relation added for in loading list: " + relation);
    }

    public void load() {
        if (relations != null) {
            relations.stream().collect(Collectors.groupingBy(Relation::repository)).forEach((repository, rs) -> {
                var ids = new ArrayList<>();
                rs.forEach(r -> {
                    if (r.relationType.equals(RelationType.MANY_TO_MANY)) {
                        ids.addAll(((List) r.sourceValue));
                    } else if (r.relationType.equals(RelationType.MANY_TO_ONE)) {
                        ids.add(r.sourceValue);
                    }
                });
                if (ids.size() > 0) {
                    var rows = repository.find(in("id", ids)).getRows();
                    rs.forEach(r -> {
                        try {
                            if (r.relationType.equals(RelationType.MANY_TO_MANY)) {
                                r.field().set(r.destination(), rows.stream().filter(e -> ((List)r.sourceValue).contains(e.getId())).toList());
                            } else if (r.relationType.equals(RelationType.MANY_TO_ONE)) {
                                r.field().set(r.destination(), rows.stream().filter(e -> e.getId().equals(r.sourceValue())).findFirst().orElse(null));
                            }
                        } catch (IllegalAccessException e) {
                            logger.warn("cannot set related entity", e);
                        }
                    });

                    logger.info(String.format("Loaded %d related entities for %s", rs.size(), repository.getEntityType().getSimpleName()));
                }
            });
        }
    }
}
