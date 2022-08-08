package applica.framework.library.cache;

/**
 * Created by bimbobruno on 27/10/2016.
 */
public abstract class Cache {

    public static final long TIME_INFINITE = -1;
    public static final long TIME_ONE_SECOND = 1000;
    public static final long TIME_ONE_MINUTE = 1000 * 60;
    public static final long TIME_FIVE_MINUTES = TIME_ONE_MINUTE * 5;
    public static final long TIME_TEN_MINUTES = TIME_ONE_MINUTE * 10;
    public static final long TIME_HALF_HOUR = TIME_ONE_MINUTE * 30;
    public static final long TIME_ONE_HOUR = TIME_ONE_MINUTE * 60;


    /**
     * Puts value into cache
     * @param path the path of value to cache (es: put("users.10.friends", friendsList))
     * @param validity represents how much time will survive into cache (in milliseconds)
     * @param value value to cache
     */
    public abstract void put(String path, long validity, Object value);

    /**
     * Puts value into cache
     * @param path the path of value to cache (es: put("users.10.friends", friendsList))
     * @param value value to cache
     */
    public abstract void put(String path, Object value);

    /**
     * Gets cached value or null if no cached value or expired
      * @param path
     */
    public abstract Object get(String path);

    /**
     * Invalidate cache of specified path. If path terminates widh *, all paths that starts with specified path will be invalidated
     * @param path
     */
    public abstract void invalidate(String path);

    /**
     * Clean cache values from expired ones
     */
    public abstract void clear();

    /**
     * Delete ALL cache values
     */
    public abstract void forceClear();

    public abstract String dump();
}
