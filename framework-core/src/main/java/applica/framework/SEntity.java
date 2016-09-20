package applica.framework;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 25/10/13
 * Time: 18:06
 */
public class SEntity implements StringIdEntity, Entity {

    protected String id;

    public static String checkedId(Object id) {
        if (id == null) {
            return null;
        }

        return id.toString();
    }

    @Override
    public Object getId() {
        return id;
    }

    @Override
    public void setId(Object id) {
        this.id = checkedId(id);
    }


    @Override
    public void setSid(String sid) {
        setId(sid);
    }

    @Override
    public String getSid() {
        return checkedId(id);
    }
}
