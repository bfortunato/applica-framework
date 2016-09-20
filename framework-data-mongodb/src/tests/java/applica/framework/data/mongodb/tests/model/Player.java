package applica.framework.data.mongodb.tests.model;

import applica.framework.SEntity;
import org.bson.types.ObjectId;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 31/10/14
 * Time: 12:31
 */
public class Player extends SEntity {

    public static final String BRUNO_ID = ObjectId.get().toString();
    public static final String MASSIMO_ID = ObjectId.get().toString();

    private String name;

    public Player(String id, String name) {
        setId(id);
        this.name = name;
    }

    public Player() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
