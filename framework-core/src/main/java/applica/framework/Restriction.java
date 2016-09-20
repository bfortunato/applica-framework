package applica.framework;

/**
 * Created by iaco on 09/02/16.
 */
// user for add custom sql restriction such as "1=1 order by rand()"
public class Restriction {

    private String sqlResriction;

    public String getSqlResriction() {
        return sqlResriction;
    }

    public void setSqlResriction(String sqlResriction) {
        this.sqlResriction = sqlResriction;
    }
}
