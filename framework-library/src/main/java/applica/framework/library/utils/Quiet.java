package applica.framework.library.utils;

import java.util.Objects;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 01/04/14
 * Time: 19:17
 */
public class Quiet {

    @FunctionalInterface
    public interface QuietAction {
        void act() throws Exception;
    }

    public static Exception exec(QuietAction action) {
        Exception ex = null;
        Objects.requireNonNull(action, "Action cannot be null");
        try {
            action.act();
        } catch(Exception innerE) {
            ex = innerE;
        }

        return ex;
    }

}
