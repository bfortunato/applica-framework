package applica.framework.library;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 3/20/13
 * Time: 12:41 PM
 */
public class GroupedItem extends SimpleItem {
    private String group;

    public GroupedItem(String group) {
        this.group = group;
    }

    public GroupedItem(String label, String value, String group) {
        super(label, value);
        this.group = group;
    }

    public String getGroup() {
        return group;
    }

    public void setGroup(String group) {
        this.group = group;
    }
}
