package applica.framework;

/**
 * Created by bimbobruno on 13/02/2017.
 */

import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;

/**
 * Provides methods to have a rapid access to repositories
 */
public class Repo {

    private static RepositoriesFactory s_repositoriesFactory;

    private static HashMap<Class<? extends Entity>, Repository<? extends Entity>> cache = new HashMap<>();

    public static <T extends Entity> Repository<T> of(Class<T> type) {
        if (cache.containsKey(type)) {
            return (Repository<T>) cache.get(type);
        }

        if (s_repositoriesFactory == null) {
            s_repositoriesFactory = ApplicationContextProvider.provide().getBean(RepositoriesFactory.class);
        }

        Repository<T> repo = s_repositoriesFactory.createForEntity(type);
        cache.put(type, repo);

        return repo;
    }

}
