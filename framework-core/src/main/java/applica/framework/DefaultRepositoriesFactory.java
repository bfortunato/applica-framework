package applica.framework;

import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 08/10/14
 * Time: 15:24
 */

/**
 * This is the default implementation for repositories factory
 */
public class DefaultRepositoriesFactory implements RepositoriesFactory {

    @Autowired
    private ApplicationContext applicationContext;

    private HashMap<Class<? extends Entity>, DefaultRepository> defaultRepositories = new HashMap<>();

    @Override
    public Repository createForEntity(Class<? extends Entity> type) {
        Repository repository = null;

        try {
            repository = applicationContext.getBeansOfType(Repository.class).values().stream()
                    .filter(r -> !(r instanceof DefaultRepository))
                    .filter(r -> r.getEntityType().equals(type))
                    .findFirst()
                    .orElseThrow(() -> new NoSuchBeanDefinitionException("repository " + type.getName()));
        } catch (NoSuchBeanDefinitionException e) {
            if (defaultRepositories.containsKey(type)) {
                return defaultRepositories.get(type);
            }

            repository = (DefaultRepository) applicationContext.getBean("default-repository");
            ((DefaultRepository) repository).setEntityType(type);

            defaultRepositories.put(type, ((DefaultRepository) repository));
        }

        return repository;
    }

    @Override
    public Repository create(Class<? extends Repository> type) {
        return applicationContext.getBean(type);
    }

}
