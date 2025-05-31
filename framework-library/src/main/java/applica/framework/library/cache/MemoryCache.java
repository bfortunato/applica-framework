package applica.framework.library.cache;

import applica.framework.Entity;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Created by bimbobruno on 27/10/2016.
 */
public class MemoryCache extends Cache {

    private final ConcurrentHashMap<String, CacheItem> data = new ConcurrentHashMap<>();

    @Override
    public void put(final String path, long validity, Object value) {
        CacheItem item = findItemByPath(path);
        if (item == null) {
            item = new CacheItem();
            data.put(path, item);
        }
        item.setValidity(validity);
        item.start();
        item.setPath(path);
        item.setValue(value);
    }

    @Override
    public void put(String path, Object value) {
        put(path, TIME_INFINITE, value);
    }

    @Override
    public Object get(final String path) {
        CacheItem item = findItemByPath(path);

        if (item != null) {
            if (item.isExpired()) {
                invalidate(item.getPath());
                return null;
            } else
                return item.getValue();
        }

        return null;
    }

    public void clear() {
        data.entrySet().removeIf(entry -> entry.getValue().isExpired());
    }

    public List<CacheItem> generateItemsToInvalidate(String path) {

        List<String> keysToInvalidate = data.keySet().stream().filter(key -> {

            if (path.startsWith("*") && path.endsWith("*")) {
                return key.contains(path.substring(1, path.length() - 2));
            } else if (path.endsWith("*")) {
                return key.startsWith(path.substring(0, path.length() - 2));
            } else if (path.startsWith("*")) {
                return key.endsWith(path.substring(1, path.length() - 1));
            }else {
                return key.equals(path);
            }
        }).collect(Collectors.toList());

        return keysToInvalidate.stream().map(k -> data.get(k)).collect(Collectors.toList());
    }

    public CacheItem findItemByPath(final String path) {
        return data.get(path);
    }

    @Override
    public void invalidate(final String path) {

        try {
            List<CacheItem> invalid = generateItemsToInvalidate(path);
            invalid.forEach(i -> data.remove(i.getPath()));
        } catch (Exception e) {
            e.printStackTrace();
        }

    }


    @Override
    public void forceClear() {
        data.clear();
    }

    @Override
    public String dump() {
        return data.values().stream().map(item -> item.dump()).collect(Collectors.joining(", "));
    }

    public Object getData() {
        return data;
    }
}
