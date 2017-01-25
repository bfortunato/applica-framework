package applica.framework.widgets.mapping;

public class MappingException extends Exception {

    /**
     *
     */
    private static final long serialVersionUID = -1001507478844465855L;

    private String property;


    public MappingException() {
        super();
    }

    public MappingException(String property, Throwable cause) {
        super(String.format("Error mapping property %s", property), cause);
        this.property = property;
    }

    public String getProperty() {
        return property;
    }

    public void setProperty(String property) {
        this.property = property;
    }
}
