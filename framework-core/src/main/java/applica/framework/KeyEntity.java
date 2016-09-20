package applica.framework;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 12/09/14
 * Time: 10:41
 */
public class KeyEntity implements Entity {

    private Key key = new Key();

    public Key getKey() {
        if (key == null) {
            key = new Key();
        }

        return key;
    }

    public void setKey(Key key) {
        this.key = key;
    }


    @Override
    public Object getId() {
        return getKey().getValue();
    }

    @Override
    public void setId(Object id) {
        getKey().setValue(id);
    }
}
