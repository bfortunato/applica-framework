package applica.framework;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 3/13/13
 * Time: 2:58 PM
 */
public class IEntity implements IntIdEntity, Entity {
    private Object id;

    public int getIid() {
        if(id == null) {
            return 0;
        }

        if(id instanceof Integer) {
            return (int)id;
        } else {
            return Integer.parseInt(String.valueOf(id));
        }
    }

    public void setIid(int iid) {
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

    public static int checkedId(Object id) {
        if(id == null) {
            return 0;
        }

        if(id instanceof Integer) {
            return (int)id;
        } else {
            try {
                return Integer.parseInt(String.valueOf(id));
            } catch (NumberFormatException e) {
                return 0;
            }

        }
    }
}
