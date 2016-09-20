package applica.framework.library.utils;

import org.apache.commons.lang3.StringUtils;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 08/10/14
 * Time: 15:03
 */
public class Strings {

    public static String pluralize(String singolar) {
        if (singolar.endsWith("y")) {
            return String.format("%sies", singolar.substring(0, singolar.length() - 1));
        } else {
            return String.format("%ss", singolar);
        }
    }

    public static boolean isEmpty(String str) {
        return StringUtils.isEmpty(str);
    }

    public static boolean isNotEmpty(String str) {
        return !StringUtils.isNotEmpty(str);
    }

}
