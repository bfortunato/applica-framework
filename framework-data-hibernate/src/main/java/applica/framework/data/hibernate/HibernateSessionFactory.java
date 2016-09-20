package applica.framework.data.hibernate;

import org.hibernate.Session;

/**
 * Created by bimbobruno on 06/10/15.
 */
public interface HibernateSessionFactory {
    Session getSession(String dataSource);
    void dispose(String dataSource);
}
