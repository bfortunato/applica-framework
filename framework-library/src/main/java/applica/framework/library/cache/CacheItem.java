package applica.framework.library.cache;

import java.io.Serializable;

/**
 * Created by bimbobruno on 27/10/2016.
 */
public class CacheItem implements Serializable {

    private String path;
    private long expiringTime;
    private Object value;

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public long getExpiringTime() {
        return expiringTime;
    }

    public void setExpiringTime(long expiringTime) {
        this.expiringTime = expiringTime;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }
}
