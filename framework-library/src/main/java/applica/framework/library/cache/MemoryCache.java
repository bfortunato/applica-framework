package applica.framework.library.cache;

import applica.framework.Entity;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.Predicate;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by bimbobruno on 27/10/2016.
 */
public class MemoryCache extends Cache {

    private final List<CacheItem> data = new ArrayList<>();

    @Override
    public void put(final String path, long validity, Object value) {
        CacheItem item = findItemByPath(path);
        if (item == null) {
            item = new CacheItem();
            synchronized (data) {
                data.add(item);
            }
        }
        item.setExpiringTime(validity != TIME_INFINITE ? System.currentTimeMillis() + validity : TIME_INFINITE);
        item.setPath(path);
        item.setValue(value);
    }

    @Override
    public void put(String path, Object value) {
        put(path, TIME_INFINITE, value);
    }

    @Override
    public Object get(final String path) {
        clear();

        CacheItem item = findItemByPath(path);

        if (item != null) {
            if (item.getExpiringTime() != TIME_INFINITE) {
                if (item.isExpired()) {
                    invalidate(item.getPath());
                    return null;
                } else {
                    return item.getValue();
                }
            } else {
                return item.getValue();
            }
        }

        return null;
    }

    public void clear() {
        synchronized (data) {
            data.removeIf(CacheItem::isExpired);
        }
    }

    public List<CacheItem> generateItemsToInvalidate(List<CacheItem> data, String path) {
        return data.stream().filter(item -> {
            if (path.startsWith("*") && path.endsWith("*")) {
                return item.getPath().contains(path.substring(1, path.length() - 2));
            } else if (path.endsWith("*")) {
                return item.getPath().startsWith(path.substring(0, path.length() - 2));
            } else if (path.startsWith("*")) {
                return item.getPath().endsWith(path.substring(1, path.length() - 1));
            }else {
                return item.getPath().equals(path);
            }
        }).collect(Collectors.toList());
    }

    public CacheItem findItemByPath(final String path) {
        synchronized (data) {
            return data.stream().filter(o -> path.equals(o.getPath())).findFirst().orElse(null);
        }
    }

    @Override
    public void invalidate(final String path) {
        synchronized (data) {
            List<CacheItem> invalid = generateItemsToInvalidate(data, path);;

            for (CacheItem item : invalid) {
                data.remove(item);
            }
        }
    }


    @Override
    public void forceClear() {
        synchronized (data) {
            data.clear();
        }
    }

    @Override
    public String dump() {
        List<String> dump = new ArrayList<>();
        synchronized (data) {
            for (CacheItem item: data) {
                if (!item.isExpired())
                    dump.add(item.dump());
            }
        }

        return String.join("\n" , dump);
    }
}
