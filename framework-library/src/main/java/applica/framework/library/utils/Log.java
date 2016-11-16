package applica.framework.library.utils;

import org.apache.commons.logging.LogFactory;

/**
 * Created by bimbobruno on 16/11/2016.
 */
public class Log {

    private static org.apache.commons.logging.Log logger = LogFactory.getLog("_APPNAME_");

    public static int LEVEL_OFF = 0;
    public static int LEVEL_INFO = 1;
    public static int LEVEL_WARNING = 2;
    public static int LEVEL_ERROR = 3;

    public static int level = LEVEL_INFO;

    public static void i(String format, Object... values) {
        if (level >= LEVEL_INFO) {
            logger.info(String.format(format, values));
        }
    }

    public static void w(String format, Object... values) {
        if (level >= LEVEL_WARNING) {
            logger.warn(String.format(format, values));
        }
    }

    public static void e(String format, Object... values) {
        if (level >= LEVEL_ERROR) {
            logger.error(String.format(format, values));
        }
    }

}
