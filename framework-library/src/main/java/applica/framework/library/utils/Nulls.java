package applica.framework.library.utils;

/**
 * Created by bimbobruno on 10/03/16.
 */
public class Nulls {

    public interface Safe<R> {
        R eval();
    }

    public static boolean areNotNull(Object... objects) {
        for (Object o : objects) {
            if (o == null) {
                return false;
            }
        }

        return true;
    }

    public static <T> T orElse(T obj, T defaultValue) {
        if (obj != null) {
            return obj;
        } else {
            return defaultValue;
        }
    }

    public static <T> T require(T obj) {
        return require(obj, "Value is required");
    }

    public static <T> T require(T obj, String exceptionMessage) {
        if (obj == null) {
            throw new RuntimeException(exceptionMessage);
        }

        return obj;
    }

    public static <T> T get(Safe<T> func, T default_) {
        try {
            T val = func.eval();
            if(val == null) {
                return default_;
            } else {
                return val;
            }
        } catch(NullPointerException e) {
            return default_;
        }
    }

    public static <T> T get(Safe<T> func) {
        return get(func, null);
    }

    public static <T> T getOrExcept(T value, String errorMessage) {
        if(value == null) {
            throw new ProgramException(errorMessage);
        }

        return value;
    }

}
