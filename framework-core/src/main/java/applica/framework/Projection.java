package applica.framework;

public class Projection {
    private String property;
    private boolean visible;

    public Projection(String property, boolean visible) {
        this.property = property;
        this.visible = visible;
    }

    public Projection() {}

    public String getProperty() {
        return property;
    }

    public void setProperty(String property) {
        this.property = property;
    }

    public boolean isVisible() {
        return visible;
    }

    public void setVisible(boolean visible) {
        this.visible = visible;
    }
}
