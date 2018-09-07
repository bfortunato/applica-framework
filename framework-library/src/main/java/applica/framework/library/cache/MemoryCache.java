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
        clean();

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

    public void clean() {
        synchronized (data) {
            data.removeIf(item -> item.getExpiringTime() <= System.currentTimeMillis());
        }
    }

    private CacheItem findItemByPath(final String path) {
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
            List<CacheItem> invalid = new ArrayList<>();
            for (CacheItem item : data) {
                if (path.endsWith("*")) {
                    if (item.getPath().startsWith(path.substring(0, path.length() - 2))) {
                        invalid.add(item);
                    }
                } else {
                    if (item.getPath().equals(path)) {
                        invalid.add(item);
                    }
                }
            }

            for (CacheItem item : invalid) {
                data.remove(item);
            }
        }
    }

    @Override
    public void clear() {
        List<CacheItem> toRemove = new ArrayList<>();
        synchronized (data) {
            for (CacheItem item: data) {
                if (item.getExpiringTime() != TIME_INFINITE) {
                    if (item.getExpiringTime() <= System.currentTimeMillis()) {
                        toRemove.add(item);
                    }
                }
            }
            if (toRemove.size() > 0) {
                for (CacheItem item: toRemove) {
                    data.remove(item);
                }
            }
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
}
