package applica.framework.data.hibernate;

import applica.framework.library.options.OptionsManager;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Objects;


/**
 * Applica (www.applicadoit.com)
 * User: bimbobruno
 * Date: 01/10/14
 * Time: 18:55
 */
public class HibernateHelper {

    @Autowired
    private OptionsManager options;

    private SessionFactory sessionFactory;

    public void createSessionFactory() {
        if (sessionFactory == null) {
            Configuration configuration = new Configuration();
            configuration.configure();

            ServiceRegistry serviceRegistry = new StandardServiceRegistryBuilder().applySettings(configuration.getProperties()).build();
            sessionFactory = configuration.buildSessionFactory(serviceRegistry);
        }
    }

    public Session getCurrentSession() {
        createSessionFactory();
        Objects.requireNonNull(sessionFactory, "Session factory is not initialized correctly");

        return sessionFactory.getCurrentSession();
    }

    public Session getSession() {
        createSessionFactory();
        Objects.requireNonNull(sessionFactory, "Session factory is not initialized correctly");

        return sessionFactory.openSession();
    }

    public void dispose() {
        if (sessionFactory != null) {
            sessionFactory.close();
        }
    }

}
