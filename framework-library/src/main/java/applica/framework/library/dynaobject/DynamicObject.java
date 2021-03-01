package applica.framework.library.dynaobject;

/**
 * Created by bimbobruno on 11/16/17.
 */
public interface DynamicObject {

    Object getProperty(String key);
    void setProperty(String key, Object value);
    void removeProperty(String key);
    void clearProperties();
    <T> T get(String key);

}
