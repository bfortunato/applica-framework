package applica.framework.library.cache;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.Predicate;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by bimbobruno on 27/10/2016.
 */
public class MemoryCache extends Cache {

    private List<CacheItem> data = new ArrayList<>();

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
                if (item.getExpiringTime() <= System.currentTimeMillis()) {
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

    public CacheItem findItemByPath(final String path) {
        synchronized (data) {
            CacheItem item = ((CacheItem) CollectionUtils.find(data, new Predicate() {
                @Override
                public boolean evaluate(Object o) {
                    return path.equals(((CacheItem) o).getPath());
                }
            }));

            return item;
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

    public List<CacheItem> generateItemsToInvalidate(List<CacheItem> data, String path) {
        List<CacheItem> invalid = new ArrayList<>();
        data.removeIf(item -> {
            if (path.startsWith("*") && path.endsWith("*")) {
                return item.getPath().contains(path.substring(1, path.length() - 2));
            } else if (path.endsWith("*")) {
                return item.getPath().startsWith(path.substring(0, path.length() - 2));
            } else if (path.startsWith("*")) {
                return item.getPath().endsWith(path.substring(1, path.length() - 1));
            }else {
                return item.getPath().equals(path);
            }
        });

        return invalid;
    }

    @Override
    public void clear() {
        synchronized (data) {
            data.removeIf(item -> item.getExpiringTime() != TIME_INFINITE && item.getExpiringTime() <= System.currentTimeMillis());
        }
    }

    @Override
    public void forceClear() {
        List<CacheItem> toRemove = new ArrayList<>();
        synchronized (data) {
            for (CacheItem item: data) {
                toRemove.add(item);
            }
            if (toRemove.size() > 0) {
                for (CacheItem item: toRemove) {
                    data.remove(item);
                }
            }
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
