package applica._APPNAME_.services;

import applica.framework.Entity;

public interface CachingService {
    Entity getEntityCachingAware(String id, Class<? extends Entity> type);

    void clearCaches();

    Object getValueFromCache(String key);

    void putValueInCache(String key, Object value, long validity);

    void putValueInCache(String key, Object value);

    void invalidate(String key);
}
