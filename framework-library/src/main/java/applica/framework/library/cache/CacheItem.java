package applica.framework.library.cache;

import applica.framework.AEntity;

import java.io.Serializable;

/**
 * Created by bimbobruno on 27/10/2016.
 */
public class CacheItem extends AEntity implements Serializable {

    private String path;
    private long expiringTime;
    private Object value;
    private long validity;

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

    public boolean isExpired() {
        return validity > 0 && getExpiringTime() <= System.currentTimeMillis();
    }

    public String dump() {
        return String.format("%s - %s", path, value != null? value.toString() : null);
    }

    public void setValidity(long validity) {
        this.validity = validity;
    }

    public long getValidity() {
        return validity;
    }

    public void start() {
        setExpiringTime(validity > 0 ? System.currentTimeMillis() + validity : validity);
    }
}
