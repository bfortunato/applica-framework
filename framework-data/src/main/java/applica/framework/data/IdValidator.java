package applica.framework.data;

public interface IdValidator {

    boolean isValid(Object id);
    Object newInstance(Object source);

}
