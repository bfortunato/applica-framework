package applica.framework;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 08/10/14
 * Time: 15:20
 */

/**
 * This interface is used to implement default repositories for classes where a custom repository is not provided
 */
public interface DefaultRepository<T extends Entity> extends Repository<T> {

    public void setEntityType(Class<T> type);

}
