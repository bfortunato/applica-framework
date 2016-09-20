package applica.framework;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 12/09/14
 * Time: 10:35
 */
public class Key {

    private Object value;

    public Key(Object value) {
        setValue(value);
    }

    public Key() {

    }

    public String getString() {
        if (value != null) {
            return value.toString();
        }

        return null;
    }

    public int getInt() {
        return IEntity.checkedId(value);
    }

    public long getLong() {
        return LEntity.checkedId(value);
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = AEntity.checkedId(value);
    }

    public Object get() {
        return value;
    }

    public void set(Object value) {
        this.value = AEntity.checkedId(value);
    }

}
