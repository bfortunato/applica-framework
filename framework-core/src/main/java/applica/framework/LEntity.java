package applica.framework;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 3/13/13
 * Time: 2:58 PM
 */
public class LEntity implements LongIdEntity, Entity {
    private Object id;

    public long getLid() {
        if(id == null) {
            return 0;
        }

        if(id instanceof Long) {
            return (long)id;
        } else {
            return Long.parseLong(String.valueOf(id));
        }
    }

    public void setLid(long iid) {
        this.id = iid;
    }

    @Override
    public Object getId() {
        return id;  //To change body of implemented methods use File | Settings | File Templates.
    }

    @Override
    public void setId(Object id) {
        this.id = id;
    }

    public static long checkedId(Object id) {
        if(id == null) {
            return 0;
        }

        if(id instanceof Long) {
            return (long)id;
        } else {
            try {
                return Long.parseLong(String.valueOf(id));
            } catch (NumberFormatException e) {
                return 0;
            }
        }
    }
}
