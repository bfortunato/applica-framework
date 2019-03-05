package applica._APPNAME_.services.impl;

import applica._APPNAME_.services.CachingService;
import applica.framework.Entity;
import applica.framework.Repo;
import applica.framework.library.cache.Cache;
import applica.framework.library.options.OptionsManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.PostConstruct;

@Service
public class CachingServiceImpl implements CachingService {

    @Autowired
    private OptionsManager optionsManager;

    @Autowired
    private Cache cache;

    private boolean cachingEnabled;

    @PostConstruct
    public void init() {
        String param = optionsManager.get("enable.caching");
        cachingEnabled = StringUtils.hasLength(param) && param.equals("ON");
    }

    public Entity getEntityCachingAware(String id, Class<? extends Entity> type, long expiringTime) {
        Entity entity = null;
        if (cachingEnabled) {
            entity = (Entity) cache.get(generateEntityCachingPath(type, id));
        } else {
            entity = Repo.of(type).get(id).orElse(null);
        }

        if (cachingEnabled && entity == null) {
            entity = Repo.of(type).get(id).orElse(null);
            if (entity != null)
                cache.put(generateEntityCachingPath(type, id), expiringTime, entity);
        }

        return entity;
    }

    @Override
    public Entity getEntityCachingAware(String id, Class<? extends Entity> type) {
        return getEntityCachingAware(id, type, Cache.TIME_HALF_HOUR);
    }

    @Override
    public void clearCaches() {
        if (cachingEnabled)
            cache.clear();
    }

    @Override
    public Object getValueFromCache(String key) {
        if (cachingEnabled)
            return cache.get(key);
        return null;
    }

    @Override
    public void putValueInCache(String key, Object value, long validity) {
        if (cachingEnabled)
            cache.put(key, validity, value);
    }

    @Override
    public void putValueInCache(String key, Object value) {
       putValueInCache(key, value, Cache.TIME_HALF_HOUR);
    }

    @Override
    public void invalidate(String key) {

        if (cachingEnabled)
            cache.invalidate(key);
    }

    private String generateEntityCachingPath(Class<? extends Entity> type, String id) {
        return String.format("%s.%s", type.getSimpleName().toLowerCase(), id);
    }

}
