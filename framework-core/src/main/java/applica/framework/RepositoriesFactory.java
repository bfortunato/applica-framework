package applica.framework;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 08/10/14
 * Time: 16:09
 */

/**
 * This interface allow to create repositories
 */
public interface RepositoriesFactory {
    /**
     * Create a repository for an entity type. In default implementation the mapping is created using the repository
     * getEntityType() method
     * @param type
     * @return
     */
    Repository createForEntity(Class<? extends Entity> type);

    /**
     * Create a repository of specified class
     * @param type
     * @return
     */
    Repository create(Class<? extends Repository> type);
}
