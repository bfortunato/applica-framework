package applica.framework.revision.services.implementation;

import applica.framework.Entity;
import applica.framework.Query;
import applica.framework.Repo;
import applica.framework.annotations.ManyToMany;
import applica.framework.annotations.ManyToOne;
import applica.framework.annotations.OneToMany;
import applica.framework.revision.model.*;
import applica.framework.revision.services.RevisionService;
import applica.framework.revisions.AvoidRevision;
import applica.framework.revisions.RevisionId;
import applica.framework.security.User;
import applica.framework.widgets.entities.EntitiesRegistry;
import applica.framework.widgets.entities.EntityUtils;
import org.jsoup.helper.StringUtil;

import java.lang.reflect.Field;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;


public class BaseRevisionService implements RevisionService {

    private static final ThreadLocal<Boolean> enabled = ThreadLocal.withInitial(() -> true);

    @Override
    public boolean isRevisionEnabled(String entity) {
        return enabled.get() != null && enabled.get() && EntitiesRegistry.instance().getAllRevisionEnabledEntities().contains(entity);
    }

    @Override
    public Revision createAndSaveRevision(User user, Entity entity, Entity previousEntity) {
        Revision revision = createRevision(user, entity, previousEntity);
        if (!revision.getType().equals(RevisionType.EDIT) || (revision.getDifferences().size() > 0))
            Repo.of(Revision.class).save(revision);

        return revision;
    }

    @Override
    public Revision createRevision(User user, Entity entity, Entity previousEntity) {
        String type = createRevisionType(entity, previousEntity);
        //TODO: se entrambe le entity e previousEntity sono null il servizio andrà in nullPOinter. Questo caso si verifica solo quando faccio la revisione di sotto - oggetti che non erano valorizzati nè prima nè dopo quindi posso "permettermi" di non gestire il caso. Magari in futuro prevenirlo o gestirlo appositamente
        Class<? extends Entity> entityClass = generateEntityClass(entity, previousEntity);
        String entityId = String.valueOf(generateEntityId(entity, previousEntity));
        Revision revision = createNewRevision(user, type, entityClass, entityId, entity, previousEntity);
        revision.setCode(getLastCodeForEntityRevision(entityId, entityClass));
        return revision;

    }

    private Class<? extends Entity> generateEntityClass(Entity entity, Entity previousEntity) {
        return entity != null ? entity.getClass() : previousEntity.getClass();
    }

    private Object generateEntityId(Entity entity, Entity previousEntity) {
        return entity != null ? entity.getId() : previousEntity.getId();
    }

    private String createRevisionType(Entity entity, Entity previousEntity) {
        if (entity != null && previousEntity == null)
            return RevisionType.CREATE;
        else if (entity == null && previousEntity != null)
            return RevisionType.DELETE;
        return RevisionType.EDIT;
    }

    private Revision createNewRevision(User user, String type, Class<? extends Entity> entityClass, String entityId, Entity entity, Entity previousEntity) {
        Revision revision = new Revision();
        revision.setType(type);
        revision.setEntityId(entityId);
        revision.setEntity(EntityUtils.getEntityIdAnnotation(entityClass));
        revision.setDate(new Date());

        if (user != null) {
            revision.setCreatorId(user.getId());
            revision.setCreator(user.toString());
        }

        getAllFields(entityClass).stream().filter(f -> f.getAnnotation(AvoidRevision.class) == null && (previousEntity == null || entity == null  || hasChanged(user, f, entity, previousEntity))).forEach(f -> {
                    try {
                        revision.getDifferences().addAll(createNewAttributeDifferences(user, f, entity, previousEntity));
                    } catch (Exception e) {
                    }
                }
        );

        return revision;
    }


    private boolean hasRelationsAnnotation(Field f) {
        return f.getAnnotation(ManyToMany.class) != null || f.getAnnotation(ManyToOne.class) != null || f.getAnnotation(OneToMany.class) != null;
    }


    private List<AttributeDifference> createNewAttributeDifferences(User user, Field f, Entity currentEntity, Entity previousEntity) {

        List<AttributeDifference> listToReturn = new ArrayList<>();
        f.setAccessible(true);

        Object previousValue = getActualValueFromField(f, previousEntity);


        Object currentValue = getActualValueFromField(f, currentEntity);

        if (Entity.class.isAssignableFrom(f.getType())) {
            if (hasRelationsAnnotation(f)) {
                listToReturn.add(new AttributeDifference(f, previousValue != null? String.valueOf(((Entity) previousValue).getId()) : null, currentValue != null? String.valueOf(((Entity) currentValue).getId()) : null, previousValue != null? previousValue.toString() : null, currentValue != null? currentValue.toString() : null));
            } else {
                //l'oggetto è persistito localmente nel padre: devo calcolare la differenza su tutti i campi
                Revision revision = createRevision(user, ((Entity) currentValue), ((Entity) previousValue));
                if (revision.hasDifferences()) {
                    //Aggiorno le revisioni dei sotto oggetti in modo da avere il nome del tipo oggettoFiglio.campoOggettoFiglio
                    revision.getDifferences().forEach(d -> d.setName(String.format("%s.%s", f.getName(), d.getName())));
                    listToReturn.addAll(revision.getDifferences());
                } else if (revision.getType().equals(RevisionType.DELETE)) {
                    listToReturn.add(new AttributeDifference(f, previousValue.toString(), null, previousValue.toString(), null));
                }
            }

        } else if (List.class.isAssignableFrom(f.getType())) {

            if (previousValue == null)
                previousValue = new ArrayList<>();

            if (currentValue == null)
                currentValue = new ArrayList<>();

            boolean isEntity = hasEntityValues(((List) previousValue), ((List)currentValue));
            if (hasRelationsAnnotation(f) || !isEntity) {
                String previousListValue = null, previousListDescription = null, currentListValue = null, currentListDescription = null;

                previousListValue = StringUtil.join((Collection) ((List) previousValue).stream().map(a -> isEntity ? ((Entity) a).getId() : a).collect(Collectors.toList()), ",");
                previousListDescription = isEntity ? StringUtil.join((Collection) ((List) previousValue).stream().map(a -> ((Entity) a).toString()).collect(Collectors.toList()), ",") : null;
                currentListValue = StringUtil.join((Collection) ((List) currentValue).stream().map(a -> isEntity ? ((Entity) a).getId() : a).collect(Collectors.toList()), ",");
                currentListDescription = isEntity ? StringUtil.join((Collection) ((List) currentValue).stream().map(a -> ((Entity) a).toString()).collect(Collectors.toList()), ",") : null;
                listToReturn.add(new AttributeDifference(f, previousListValue, currentListValue, previousListDescription, currentListDescription));

            } else {
                Diff diff = Diff.compute(((List) previousValue), ((List) currentValue), (o11, o21) -> areEquals(user, f, o11, o21));
                //per ciascuna delle diff eseguo una revision (perchè qualcosa è cambiato) e memorizzo i cambi,

                AtomicInteger i = new AtomicInteger(0);
                diff.getAdded().forEach(a -> {
                    i.incrementAndGet();
                    Revision revision = createRevision(user, (Entity) a, null);
                    revision.getDifferences().forEach(d -> d.setName(String.format("%s[%s].%s", f.getName(), i.get() , d.getName())));
                    listToReturn.addAll(revision.getDifferences());

                });
                AtomicInteger j = new AtomicInteger(0);
                diff.getDeleted().forEach(a -> {
                    j.incrementAndGet();
                    Revision revision = createRevision(user,null, ((Entity) a));
                    revision.getDifferences().forEach(d -> d.setName(String.format("%s[%s].%s", f.getName(), j.get(), d.getName())));
                    listToReturn.addAll(revision.getDifferences());
                });
            }

        } else {
            listToReturn.add(new AttributeDifference(f, previousValue != null? previousValue.toString() : null, currentValue != null? currentValue.toString() : null, null, null));
        }

        return listToReturn;
    }

    private boolean hasEntityValues(List previousValue, List currentValue) {
        if (previousValue != null && previousValue.size() > 0)
            return Entity.class.isAssignableFrom(previousValue.get(0).getClass());
        return currentValue != null && currentValue.size() > 0 && Entity.class.isAssignableFrom(currentValue.get(0).getClass());

    }

    private Object getActualValueFromField(Field f, Entity previousEntity) {
        boolean isRevisionId = f.getAnnotation(RevisionId.class) != null;
        Object previousValue = null;
        if (previousEntity != null) {
            try {
                previousValue = f.get(previousEntity);
                previousValue = isRevisionId && previousValue != null ? Repo.of(f.getAnnotation(RevisionId.class).value()).get(previousValue).orElse(null) : previousValue;
            } catch (IllegalAccessException e) {
            }
        }
        return previousValue;
    }


    @Override
    public List<Revision> getRevisionsForEntity(Entity entity) {
        return Repo.of(Revision.class).find(Query.build().eq("entityId", entity.getId()).eq("entity", entity).sort("date", true)).getRows();
    }

    private List<Field> getAllFields(Class<? extends Object> type) {
        List<Field> fields = new ArrayList<Field>();
        for (Class<?> c = type; c != null; c = c.getSuperclass()) {
            fields.addAll(Arrays.asList(c.getDeclaredFields()));
        }
        return fields;
    }

    /**
     * la funzione controlla l'uguaglianza dei due field passati come parametro.
     *
     * @param o1
     * @param o2
     * @return
     */
    private boolean areEquals(User user, Field f, Object o1, Object o2) {


        if (o1 != null && o2 != null) {

            if (o1 instanceof Entity && o2 instanceof Entity) {
                if (hasRelationsAnnotation(f))
                    return Objects.equals(((Entity) o1).getId(), ((Entity) o2).getId());
                else {
                    //Se sono davanti ad entità annidate NON annotate devo verificare la differenza in profondità tra esse
                    Revision revision = createRevision(user,((Entity) o1), ((Entity) o2));
                    return !revision.hasDifferences();
                }
            } else if (o1 instanceof List && o2 instanceof List) {

                Diff diff = Diff.compute(((List) o1), ((List) o2), (o11, o21) -> areEquals(user, f, o11, o21));
                return !diff.hasChanges();


            } else
                return Objects.equals(o1, o2);

        } else
            return Objects.equals(o1, o2);
    }


    private boolean hasChanged(User user, Field f, Entity currentEntity, Entity previousEntity) {

        try {

            f.setAccessible(true);

            Object current = f.get(currentEntity);
            Object previous = f.get(previousEntity);
            return !areEquals(user, f, current, previous);
        } catch (Exception e) {

            return false;
        }
    }


    private long getLastCodeForEntityRevision(String entityId, Class<? extends Entity> entity) {
        Revision last = Repo.of(Revision.class).find(Query.build().eq("entityId", entityId).eq("entity", EntityUtils.getEntityIdAnnotation(entity)).sort("date", true).page(1).rowsPerPage(1)).findFirst().orElse(null);
        return last != null ? last.getCode() + 1 : 1;
    }

    private RevisionSettings createNewSettings() {
        RevisionSettings settings = new RevisionSettings();
        disableRevisionForCurrentThread();
        Repo.of(RevisionSettings.class).save(settings);
        enableRevisionForCurrentThread();
        return settings;
    }

    @Override
    public void enableRevisionForCurrentThread() {
        enabled.set(true);
    }

    @Override
    public void disableRevisionForCurrentThread() {
        enabled.set(false);
    }

    @Override
    public boolean executeRevisionInOtherThread() {
        return true;
    }
}
