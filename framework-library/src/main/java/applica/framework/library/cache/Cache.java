package applica.framework.library.cache;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 2/22/13
 * Time: 12:10 PM
 */
public interface Cache {
    Object get(String key);
    void put(String key, Object value);
}
