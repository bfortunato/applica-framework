package applica.framework.data.hibernate;

import applica.framework.*;
import applica.framework.data.KeywordQueryBuilder;
import applica.framework.library.utils.TypeUtils;
import org.apache.commons.beanutils.ConvertUtils;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Autowired;

import java.lang.reflect.Field;
import java.util.*;
import java.util.function.Consumer;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 09/10/14
 * Time: 11:31
 */
public abstract class HibernateRepository<T extends Entity> implements Repository<T>, DisposableBean {

    @Autowired
    private HibernateSessionFactory hibernateSessionFactory;

    @Override
    public void destroy() {
        hibernateSessionFactory.dispose(getDataSource());
    }

    public Session getSession() {
        return hibernateSessionFactory.getSession(getDataSource());
    }

    public void withSession(Consumer<Session> consumer) {
        Session session = getSession();
        consumer.accept(session);
        session.close();
    }

    @Autowired
    private CrudStrategy crudStrategy;

    @Override
    public Optional<T> get(Object id) {
        T entity = crudStrategy.get(id, this);

        return Optional.ofNullable(entity);
    }

    @Override
    public Result<T> find(Query query) {
        if(query == null) query = new Query();

        if (StringUtils.isNotEmpty(query.getKeyword())) {
            query = this.keywordQuery(query);
        }

        Result response = crudStrategy.find(query, this);

        return response;
    }

//    private Object checkedValue(Filter filter) {
//        try {
//            //the property can be null in case of id filter type
//            if (StringUtils.isNotEmpty(filter.getProperty())) {
//                Class destinationType = TypeUtils.getNestedFieldType(getEntityType(), filter.getProperty());
//                return ConvertUtils.convert(filter.getValue(), destinationType);
//            }
//        } catch (NoSuchFieldException e) { /*default value if this error */ }
//
//        return filter.getValue();
//    }
//
//    public void addRestrictionToCriterion(Object parent, Criterion child) {
//        if (parent instanceof org.hibernate.criterion.Disjunction) {
//            ((org.hibernate.criterion.Disjunction) parent).add(child);
//        }
//        else  if (parent instanceof org.hibernate.criterion.Conjunction) {
//                ((org.hibernate.criterion.Conjunction) parent).add(child);
//        } else if (parent instanceof Criteria) {
//            ((Criteria) parent).add(child);
//        } else {
//            throw new RuntimeException("Error in addRestrictionToCriterion(). Type not allowed: " + parent.getClass().toString());
//        }
//    }
//
//    public void pushFilter(Object criterion, Filter filter) {
//        Assert.isTrue(criterion instanceof org.hibernate.criterion.Disjunction || criterion instanceof org.hibernate.criterion.Conjunction ||  criterion instanceof Criteria);
//
//        if (filter.getType() == Filter.OR) {
//            org.hibernate.criterion.Disjunction disjunction = Restrictions.disjunction();
//            List<Filter> ors = (List<Filter>) filter.getValue();
//            for (Filter or : ors) {
//                pushFilter(disjunction, or);
//            }
//            addRestrictionToCriterion(criterion, disjunction);
//        } else if (filter.getType() == Filter.AND){
//            org.hibernate.criterion.Conjunction conjunction = Restrictions.conjunction();
//            List<Filter> ands = (List<Filter>) filter.getValue();
//            for (Filter and : ands) {
//                pushFilter(conjunction, and);
//            }
//            addRestrictionToCriterion(criterion, conjunction);
//        }else {
//            Object value = checkedValue(filter);
//            switch (filter.getType()) {
//                case Filter.LIKE:
//                    addRestrictionToCriterion(criterion, Restrictions.like(filter.getProperty(), String.format("%%%s%%", value)));
//                    break;
//                case Filter.GT:
//                    addRestrictionToCriterion(criterion, Restrictions.gt(filter.getProperty(), value));
//                    break;
//                case Filter.GTE:
//                    addRestrictionToCriterion(criterion, Restrictions.ge(filter.getProperty(), value));
//                    break;
//                case Filter.LT:
//                    addRestrictionToCriterion(criterion, Restrictions.lt(filter.getProperty(), value));
//                    break;
//                case Filter.LTE:
//                    addRestrictionToCriterion(criterion, Restrictions.le(filter.getProperty(), value));
//                    break;
//                case Filter.EQ:
//                    addRestrictionToCriterion(criterion, Restrictions.eq(filter.getProperty(), value));
//                    break;
//                case Filter.IN:
//                    addRestrictionToCriterion(criterion, Restrictions.in(filter.getProperty(), (List) value));
//                    break;
//                case Filter.NIN:
//                    addRestrictionToCriterion(criterion, Restrictions.not(Restrictions.in(filter.getProperty(), (List) value)));
//                    break;
//                case Filter.ID:
//                    Object id = value;
//                    long lid = LEntity.checkedId(id);
//                    if (lid > 0) {
//                        id = lid;
//                    }
//                    if (filter.getProperty() == null) {
//                        addRestrictionToCriterion(criterion, Restrictions.idEq(id));
//                    } else {
//                        addRestrictionToCriterion(criterion, Restrictions.eq(filter.getProperty(), id));
//                    }
//                    break;
//            }
//        }
//    }
//
//    public Criteria createCriteria(Session session, Query loadRequest) {
//        Criteria criteria = session.createCriteria(getEntityType());
//
//        for(Filter filter : loadRequest.getFilters()) {
//            if(filter.getValue() == null) {
//                continue;
//            }
//
//            pushFilter(criteria, filter);
//        }
//
//        return criteria;
//    }



    public void addRestrictionToCriterion(Object parent, Criterion child) {
        if (parent instanceof org.hibernate.criterion.Disjunction) {
            ((org.hibernate.criterion.Disjunction) parent).add(child);
        } else if (parent instanceof org.hibernate.criterion.Conjunction) {
            ((org.hibernate.criterion.Conjunction) parent).add(child);
        }
        else if (parent instanceof Criteria) {
            ((Criteria) parent).add(child);
        } else {
            throw new RuntimeException("Error in addRestrictionToCriterion(). Type not allowed: " + parent.getClass().toString());
        }
    }

    public Criteria createCriteria(Session session, Query query) {
        Criteria criteria = session.createCriteria(this.getEntityType());
        Iterator iterator = query.getFilters().iterator();

        while(iterator.hasNext()) {
            Filter filter = (Filter)iterator.next();
            if(filter.getValue() != null) {
                //inserisco il criterio di base per permettermi, in caso di join
                //di creare l'alias
                this.pushFilter(criteria, filter, criteria);
            }
        }

        return criteria;
    }




    public void pushFilter(Object criterion, Filter filter, Criteria baseCriteria) {
        //  Assert.isTrue(criterion instanceof org.hibernate.criterion.Disjunction || criterion instanceof Criteria);

        if (filter.getType().equals(Filter.OR)) {
            org.hibernate.criterion.Disjunction disjunction = Restrictions.disjunction();
            List<Filter> ors = (List<Filter>) filter.getValue();
            for (Filter or : ors) {
                pushFilter(disjunction, or, baseCriteria);
            }
            addRestrictionToCriterion(criterion, disjunction);
            //aggiungo la gesitone ricorsiva della conjunction
        } else if (filter.getType().equals(Filter.AND)) {
            org.hibernate.criterion.Conjunction conjunction = Restrictions.conjunction();
            List<Filter> ands = (List<Filter>) filter.getValue();
            for (Filter and : ands) {
                pushFilter(conjunction, and, baseCriteria);
            }
            addRestrictionToCriterion(criterion, conjunction);

        }else {
            Object value = checkedValue1(filter);
            switch (filter.getType()) {
                case Filter.LIKE:
                    addRestrictionToCriterion(criterion, Restrictions.like(filter.getProperty(), String.format("%%%s%%", value)));
                    break;
                case Filter.GT:
                    addRestrictionToCriterion(criterion, Restrictions.gt(filter.getProperty(), value));
                    break;
                case Filter.GTE:
                    addRestrictionToCriterion(criterion, Restrictions.ge(filter.getProperty(), value));
                    break;
                case Filter.LT:
                    addRestrictionToCriterion(criterion, Restrictions.lt(filter.getProperty(), value));
                    break;
                case Filter.LTE:
                    addRestrictionToCriterion(criterion, Restrictions.le(filter.getProperty(), value));
                    break;
                case Filter.EQ:

                    //per quanto riguarda questo criterio devo essere in grado di recuperare il filtro
                    //per propriet� che sono "valueobject" (ad esempio company.id, mail ecc) oppure propriet�
                    //many-to-one. per tali propriet� via javascript arriva direttasmente il nome della propriet�
                    //questo implica che devo recuperare l'entit� e scriverla in modalit� comprensibile per hibernate

                    PropType t1 = checkPropertyType(this.getEntityType(), filter.getProperty());
                    if (t1 == PropType.entity){

                        //se il valore del filtro � una stringa vuota lo trascuro....
                        if (filter.getValue() != null)
                            if (filter.getValue() != "") {
                                Object filterValue = value.toString();
                                try {
                                    filterValue = Long.parseLong(value.toString());
                                }catch (NumberFormatException e){
                                    //using string value of filter istead of Long.parseLong(string value)
                                }
                                addRestrictionToCriterion(criterion, Restrictions.eq(filter.getProperty() + ".id", filterValue));
                            }
                    }else{
                        addRestrictionToCriterion(criterion, Restrictions.eq(filter.getProperty(), value));
                    }




                    break;
                case Filter.NE:

                    //per quanto riguarda questo criterio devo essere in grado di recuperare il filtro
                    //per propriet� che sono "valueobject" (ad esempio company.id, mail ecc) oppure propriet�
                    //many-to-one. per tali propriet� via javascript arriva direttasmente il nome della propriet�
                    //questo implica che devo recuperare l'entit� e scriverla in modalit� comprensibile per hibernate

                    PropType t2 = checkPropertyType(this.getEntityType(), filter.getProperty());
                    if (t2 == PropType.entity){

                        //se il valore del filtro � una stringa vuota lo trascuro....
                        if (filter.getValue() != null)
                            if (filter.getValue() != "")
                                addRestrictionToCriterion(criterion, Restrictions.ne(filter.getProperty() + ".id", Long.parseLong(value.toString())));
                    }else{
                        addRestrictionToCriterion(criterion, Restrictions.ne(filter.getProperty(), value));
                    }




                    break;
                case Filter.IN:
                case Filter.LIN:

                    //il filtro lin come il filtro lnin sta per "Left join in" e "Left join not in"
                    //questo filtro � stato aggiunto per devidere il tipo di join che hibernate fa
                    //quando esegue una clausola in o una clausola non in.
                    //in questo modo il client decide come deve avvenire la query....

                    //se la clausola in � riferita ad una propriet� che � un tipo primitivo
                    //lascio inalterato il codice aspettandomi una lista di elementi....
                    PropType t = checkPropertyType(this.getEntityType(), filter.getProperty());
                    if (t == PropType.primitive)
                        addRestrictionToCriterion(criterion, Restrictions.in(filter.getProperty(), (List) value));
                    else if (t == PropType.list){
                        //altrimenti devo fornire il supporto alla ricerca di una relazione many-to-many
                        //o one-to-many
                        //per fare questo faccio l'ipotesi che il framework invii una lista di id nei filtri
                        //pertanto devo cercare tutti gli oggetti di cui almeno un figlio (lista data dalla propriet� dell'oggetto
                        //filter.getProperty()) ha l'id compreso nella lista

                        //puo' inoltre capitare, per come � strutturato il multisearchable componenet javascript,
                        //chew nel caso di selezione di un solo elelmento arrivi una stringa con l'id di quell'elemento
                        //pertanto se il value � una stringa lo trasformero' in array di stringhe con un solo elemento

                        ArrayList<Long> result = new ArrayList<Long>();
                        if (value instanceof String)
                            result.add(Long.parseLong(value.toString()));
                        else{
                            List l = (List)value;
                            for (Object o : l) {
                                result.add(Long.parseLong(o.toString()));
                            }

                        }
                        if (result.size() > 0){
                            //adesso che so trattasi di join devo creare un alias nei criteri e poi aggiungere la restriction
                            String tableAlias = "t" + filter.getProperty();
                            boolean isInnerJoin = filter.getType() == Filter.IN;
                            addAlias(baseCriteria, filter.getProperty(), tableAlias, isInnerJoin);
                            addRestrictionToCriterion(criterion, Restrictions.in(tableAlias +".id",result));
                            // addDistinctClausProjections(criterion);
                        }

                    }



                    break;
                case Filter.NIN:
                case Filter.LNIN:
                    addRestrictionToCriterion(criterion, Restrictions.not(Restrictions.in(filter.getProperty(), (List) value)));
                    break;
                case Filter.ID:
                    Object id = value;
                    long lid = LEntity.checkedId(id);
                    if (lid > 0) {
                        id = lid;
                    }
                    if (filter.getProperty() == null) {
                        addRestrictionToCriterion(criterion, Restrictions.idEq(id));
                    } else {
                        addRestrictionToCriterion(criterion, Restrictions.eq(filter.getProperty(), id));
                    }
                    break;
                case Filter.RANGE:
                    org.hibernate.criterion.Conjunction conjunction = Restrictions.conjunction();
                    List ranges = (List) filter.getValue();
                    boolean valid = false;
                    if (ranges != null && ranges.size() == 2) {
                        if (!Objects.equals(ranges.get(0), "*")) {
                            double left = Double.parseDouble(String.valueOf(ranges.get(0)));
                            conjunction.add(Restrictions.gt(filter.getProperty(), left));
                            valid = true;
                        }

                        if (!Objects.equals(ranges.get(0), "*")) {
                            double right = Double.parseDouble(String.valueOf(ranges.get(1)));
                            conjunction.add(Restrictions.gt(filter.getProperty(), right));
                            valid = true;
                        }

                        if (valid) {
                            addRestrictionToCriterion(criterion, conjunction);
                        }
                    }
                    break;
                /*
                 * Hibernate GEO Filters: used to apply geometric relationships
                 * between geographical coordinates.
                 */

                //CONTAINS: evaluates if the geometry (point, line or geometric figure) "value"
                // is contained in the "filter.getProperty()" geometry, excluding edges,
                // returning the resulting geometry.
//                case Filter.GEO_CONTAINS:
//                    addRestrictionToCriterion(criterion,
//                            SpatialRestrictions.contains(filter.getProperty(), (Geometry) value));
//                    break;
//
//                //WITHIN: evaluates if the geometry (point, line or geometric figure) "value"
//                // is contained in the "filter.getProperty()" geometry, including edges,
//                // returning the resulting geometry.
//                case Filter.GEO_WITHIN:
//                    addRestrictionToCriterion(criterion,
//                            SpatialRestrictions.within(filter.getProperty(), (Geometry) value));
//                    break;
//
//                //EQUALS: Returns 1 (TRUE, Integer) if "value" Geometry is spatially equal
//                // to "filter.getProperty()".
//                case Filter.GEO_EQ:
//                    addRestrictionToCriterion(criterion,
//                            SpatialRestrictions.eq(filter.getProperty(), (Geometry) value));
//                    break;
//
//                //DISJOINT: evaluates as a function of the geometric figure, if the geometry "value"
//                // and the geometry "filter.getProperty()" have no element in common.
//                //Returns 1 (TRUE, Integer) if "value" geometry is spatially disjoint
//                // from "filter.getProperty()".
//                case Filter.GEO_DISJOINT:
//                    addRestrictionToCriterion(criterion,
//                            SpatialRestrictions.disjoint(filter.getProperty(), (Geometry) value));
//                    break;
//
//                //INTERSECTS: geometry that contains all elements of "value" that also belong to
//                // "filter.getproperty() but no other elements
//                //Returns 1 (TRUE, Integer) if "value" geometry spatially intersects "filter.getProperty()".
//                case Filter.GEO_INTERSECTS:
//                    addRestrictionToCriterion(criterion,
//                            SpatialRestrictions.intersects(filter.getProperty(), (Geometry) value));
//                    break;
//
//                //TOUCHES: evaluates as a function of the geometric figure, if the geometry "value"
//                // spatially touches the geometry "filter.getProperty()"
//                //Returns 1 (TRUE, Integer) if "value" geometry spatially touches "filter.getProperty()".
//                case Filter.GEO_TOUCHES:
//                    addRestrictionToCriterion(criterion,
//                            SpatialRestrictions.touches(filter.getProperty(), (Geometry) value));
//                    break;
//
//                //CROSSES: evaluates as a function of the geometric figure, if the geometry "value"
//                // spatially touches the geometry "filter.getProperty()"
//                //Returns 1 (TRUE, Integer) if "value" geometry spatially crosses "filter.getProperty()".
//                case Filter.GEO_CROSSES:
//                    addRestrictionToCriterion(criterion,
//                            SpatialRestrictions.crosses(filter.getProperty(), (Geometry) value));
//                    break;
//
//                //OVERLAPS: evaluates if the "value" geometry overlaps, even only partially,
//                // the "filter.getProperty()" geometry
//                //Returns 1 (TRUE, Integer) if "value" geometry spatially overlaps "filter.getProperty()".
//                case Filter.GEO_OVERLAPS:
//                    addRestrictionToCriterion(criterion,
//                            SpatialRestrictions.overlaps(filter.getProperty(), (Geometry) value));
//                    break;
                case Filter.EXISTS:
                    boolean exists = value != null && ((Boolean) value);
                    addRestrictionToCriterion(criterion, exists ? Restrictions.isNotNull(filter.getProperty()) : Restrictions.isNull(filter.getProperty()));
            }
        }
    }
    private void addDistinctClausProjections(Object criterion){

        ((Criteria) criterion).setProjection(Projections.distinct(Projections.property("id")));
    }

    private void addAlias(Object criterion ,String property, String alias, boolean isInnerJoin){
        if (isInnerJoin)
            ((Criteria) criterion).createAlias(property, alias).setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);
        else
            ((Criteria) criterion).createAlias(property, alias, Criteria.LEFT_JOIN).setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);
    }

    private Object checkedValue1(Filter filter) {
        try {
            //the property can be null in case of id filter type
            if (StringUtils.isNotEmpty(filter.getProperty())) {
                Class destinationType = TypeUtils.getNestedFieldType(getEntityType(), filter.getProperty());
                return ConvertUtils.convert(filter.getValue(), destinationType);
            }
        } catch (Exception e) { /*default value if this error */ }

        return filter.getValue();
    }


    private PropType checkPropertyType(Class<?> clazz, String propertyName)  {

        try {
            Field f = TypeUtils.getField(clazz, propertyName);

            if (f.getType().isPrimitive())
                return PropType.primitive;

            if (TypeUtils.isListOfEntities(f.getGenericType())){
                return PropType.list;
            }

            if (TypeUtils.isEntity(f.getGenericType())) {
                return PropType.entity;
            }

        } catch (NoSuchFieldException e) {
            e.printStackTrace();

        }


        return PropType.valueobject;
    }


    private enum PropType{
        primitive,
        list,
        entity,
        valueobject
    }


    public List<Sort> getDefaultSorts() {
        return null;
    }

    @Override
    public void save(T entity) {
        crudStrategy.save(entity, this);
    }

    @Override
    public void delete(Object id) {
        crudStrategy.delete(id, this);
    }

    public String getDataSource() {
        return "default";
    }

    @Override
    public Query keywordQuery(Query query) {
        new KeywordQueryBuilder(getEntityType()).build(query);
        return query;
    }


    @Override
    public void deleteMany(Query request) {
        crudStrategy.deleteMany(request, this);
    }
}
