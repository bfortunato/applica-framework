package applica.framework.library.responses;

public class ValueResponse extends Response {
    private Object value;

    public ValueResponse() {
        super(Response.OK);
    }

    public ValueResponse(Object value) {
        super();
        this.value = value;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }


}
