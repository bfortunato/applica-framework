package applica.framework.data;

public class DefaultIdValidator implements IdValidator {
    @Override
    public boolean isValid(Object id) {
        return true;
    }

    @Override
    public Object newInstance(Object source) {
        return source;
    }
}
