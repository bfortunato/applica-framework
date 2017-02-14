package applica.framework.library;

/**
 * Created by bimbobruno on 14/02/2017.
 */
public class ObjectItem {

    private String label;
    private Object value;

    public ObjectItem() {
    }

    public ObjectItem(String label, Object value) {
        this.label = label;
        this.value = value;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }


}
