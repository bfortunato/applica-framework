package applica.framework.library.cache;

import java.util.concurrent.ConcurrentHashMap;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 2/22/13
 * Time: 12:11 PM
 */

/**
 * Simple in-memory cache implementation
 */
public class MemoryCache implements Cache {

    static ConcurrentHashMap<String, Object> cache = new ConcurrentHashMap<>();

    @Override
    public Object get(String key) {
        return cache.get(key);
    }

    @Override
    public void put(String key, Object value) {
        cache.put(key, value);
    }
}
