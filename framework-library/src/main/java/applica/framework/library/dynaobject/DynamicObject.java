package applica.framework.library.dynaobject;

/**
 * Created by bimbobruno on 11/16/17.
 */
public interface DynamicObject {

    Object get(String key);
    void set(String key, Object value);
    void remove(String key);
    void clear();

}
