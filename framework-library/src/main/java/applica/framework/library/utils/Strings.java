package applica.framework.library.utils;

import org.apache.commons.lang3.StringUtils;

import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.Objects;

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

    /* Restituisce la stringa con la prima lettera in maiuscoo
     * @param s
     * @return
             */
    public static String getFirstletterUpperCaseString(String s) {
        if (org.springframework.util.StringUtils.hasLength(s)) {
            return s.substring(0, 1).toUpperCase() + s.substring(1);
        }
        return "";
    }

    /* Restituisce una stringa in cui il separatore delle cifre decimali è la virgola
     * @param hours
     * @return
             */
    public static String getNumberWithComma(double hours) {
        String s = String.valueOf(hours);
        return s.replace(".", ",");
    }


    public static String getEuroStringFromDouble(double value) {
        NumberFormat formatter = new DecimalFormat("0.00");
        return String.format("%s",formatter.format(value));
    }

    public static boolean areDifferent(String string1, String string2) {
        return !Objects.equals(string1, string2);
    }

    public static boolean isEmpty(String str) {
        return StringUtils.isEmpty(str);
    }

    public static boolean isNotEmpty(String str) {
        return !StringUtils.isNotEmpty(str);
    }

}
