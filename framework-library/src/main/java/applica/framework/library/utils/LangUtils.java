package applica.framework.library.utils;

/**
 * Created by bimbobruno on 10/5/17.
 */
public class LangUtils {

    @FunctionalInterface
    public interface UncheckedFunction<R> {
        R exec() throws Exception;
    }

    @FunctionalInterface
    public interface UncheckedAction {
        void exec() throws Exception;
    }

    public static <R> R unchecked(UncheckedFunction<R> function) {
        try {
            return function.exec();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static void unchecked(UncheckedAction action) {
        try {
            action.exec();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}
