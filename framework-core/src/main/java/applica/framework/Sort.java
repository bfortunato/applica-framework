package applica.framework;

public class Sort {
    private String property;
    private boolean descending;

    public Sort() {
    }

    public Sort(String property, boolean descending) {
        super();
        this.property = property;
        this.descending = descending;
    }

    public String getProperty() {
        return property;
    }

    public void setProperty(String property) {
        this.property = property;
    }

    public boolean isDescending() {
        return descending;
    }

    public void setDescending(boolean descending) {
        this.descending = descending;
    }
}
