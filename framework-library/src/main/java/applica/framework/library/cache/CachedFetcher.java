package applica.framework.library.cache;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;

public class CachedFetcher<K, T> {

    final Function<K, T> fetcher;

    private HashMap<K, T> cache = new HashMap<>();

    public CachedFetcher(Function<K, T> fetcher) {
        Objects.requireNonNull(fetcher);

        this.fetcher = fetcher;
    }

    public T get(K key) {
        T value = cache.get(key);
        if (value == null) {
            value = fetcher.apply(key);
            cache.put(key, value);
        }

        return value;
    }

    public void put(K key, T value) {
        if (get(key) == null) {
            cache.put(key, value);
        }
    }

    public Set<Map.Entry<K,T>> entrySet() {
        return cache.entrySet();
    }

    public static <K, T> CachedFetcher<K, T> create(Function<K, T> fetcher) {
        return new CachedFetcher<>(fetcher);
    }

}
