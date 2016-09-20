package applica.framework.library.utils;

public interface Func<T, R> {
    R eval(T data);
}