package applica.framework.library.utils;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 4/30/13
 * Time: 4:07 PM
 */
public class NullSafe {

    public static <T> T get(NullSafeFunc<T> func, T default_) {
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

    public static <T> T get(NullSafeFunc<T> func) {
        return get(func, null);
    }

    public static <T> T getOrExcept(T value, String errorMessage) {
        if(value == null) {
            throw new ProgramException(errorMessage);
        }

        return value;
    }

    public interface NullSafeFunc<R> {
        R eval();
    }

}
