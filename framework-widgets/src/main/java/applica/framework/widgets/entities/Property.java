package applica.framework.widgets.entities;

/**
 * Created by bimbobruno on 07/12/2016.
 */
public class Property {

    private String name;
    private String type;

    public Property() {
    }

    public Property(String name, String type) {
        this.name = name;
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
