package applica.framework.data.hibernate;

import applica.framework.*;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.util.Assert;

import java.util.List;

/**
 * Created by bimbobruno on 17/09/15.
 */
public class HibernateCrudStrategy implements CrudStrategy {


    @Override
    public <T extends Entity> T get(Object id, Repository<T> repository) {
        HibernateRepository<T> hibernateRepository = ((HibernateRepository<T>) repository);
        Assert.notNull(hibernateRepository, "Specified repository is not HibernateRepository");

        Session session = hibernateRepository.getSession();

        T entity = null;

        try {
            if (id != null) {
                long iid = LEntity.checkedId(id);
                if (iid > 0) {
                    id = iid;
                }
                entity = (T) session.get(repository.getEntityType(), (java.io.Serializable) id);
            }
        } finally {
            session.close();
        }

        return entity;
    }

    @Override
    public <T extends Entity> Result<T> find(Query query, Repository<T> repository) {
        HibernateRepository<T> hibernateRepository = ((HibernateRepository<T>) repository);
        Assert.notNull(hibernateRepository, "Specified repository is not HibernateRepository");

        Result<T> result = new Result<T>();

        Session session = hibernateRepository.getSession();
        Transaction transaction = session.beginTransaction();
        try {
            Criteria countCriteria = hibernateRepository.createCriteria(session, query);
            Criteria criteria = hibernateRepository.createCriteria(session, query);

            Object countObject = countCriteria.setProjection(Projections.rowCount()).uniqueResult();
            long count = countObject != null ? (Long) countObject : 0;
            int limit = query.getRowsPerPage();
            int skip = query.getRowsPerPage() * (query.getPage() - 1);

            if (limit != 0) criteria.setMaxResults(limit);
            if (skip != 0) criteria.setFirstResult(skip);

            List<Sort> sorts = query.getSorts();
            if (sorts == null) {
                sorts = hibernateRepository.getDefaultSorts();
            }

            if (sorts != null) {
                for (Sort sort : sorts) {
                    if (sort.isDescending()) {
                        criteria.addOrder(Order.desc(sort.getProperty()));
                    } else {
                        criteria.addOrder(Order.asc(sort.getProperty()));
                    }
                }
            }

            result.setRows(criteria.list());
            result.setTotalRows(count);

            transaction.commit();
        } catch(Exception e) {
            transaction.rollback();
            throw e;
        } finally {
            session.close();
        }

        return result;
    }

    @Override
    public <T extends Entity> void save(T entity, Repository<T> repository) {
        HibernateRepository<T> hibernateRepository = ((HibernateRepository<T>) repository);
        Assert.notNull(hibernateRepository, "Specified repository is not HibernateRepository");

        if (entity != null) {
            Session session = hibernateRepository.getSession();
            Transaction tx = session.beginTransaction();
            try {
                //convert id to long if possible;
                Object oldId = entity.getId();
                long iid = LEntity.checkedId(oldId);
                if (iid > 0) {
                    entity.setId(iid);
                }

                session.saveOrUpdate(entity);
                tx.commit();
            } catch(Exception ex) {
                tx.rollback();
                throw ex;
            } finally {
                session.close();
            }
        }
    }

    @Override
    public <T extends Entity> void delete(Object id, Repository<T> repository) {
        HibernateRepository<T> hibernateRepository = ((HibernateRepository<T>) repository);
        Assert.notNull(hibernateRepository, "Specified repository is not HibernateRepository");

        if (id != null) {
            Session session = hibernateRepository.getSession();
            Transaction tx = session.beginTransaction();
            try {
                long iid = LEntity.checkedId(id);
                if (iid > 0) {
                    id = iid;
                }
                T entity = (T) session.get(hibernateRepository.getEntityType(), (java.io.Serializable) iid);
                if (entity != null) {
                    session.delete(entity);
                }
                tx.commit();
            } catch(Exception ex) {
                tx.rollback();
                throw ex;
            } finally {
                session.close();
            }
        }
    }

    @Override
    public <T extends Entity> void deleteMany(Query query, Repository<T> repository) {
        if (query != null && query.getFilters().size() > 0)
            repository.find(query).getRows().forEach(q -> {
                repository.delete(q.getId());
            });
    }
}
