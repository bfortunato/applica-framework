package applica.framework.library.utils;

import java.math.BigDecimal;

/**
 * Created by antoniolovicario on 30/03/16.
 */
public class NumberUtils {

    /**
     * Tronca la parte decimale di un numero alla n-esima cifra
     * @param number
     * @return
     */
    public static double truncateDecimalNumber(double number, int n) {
        //corrisponderà alla potenza di dieci con cui approssimare il numero
        double decimalN = Math.pow(10, n);
        return Math.floor(number * decimalN) / decimalN;
    }

    public static double getNumberFromPercentual(Double percent) {
        double number = 0;
        if (percent != null) {
            number = percent / 100;
        }
        return number;
    }

    public static float getFloatFromDouble(Double doubleNumber) {
        double number = doubleNumber != null ? doubleNumber : 0;
        BigDecimal bigDecimal = new BigDecimal(number);
        return bigDecimal.floatValue();
    }

    public static boolean areDifferent (Integer i1, Integer i2) {
        return (i1 != null && i2 == null) || (i1 == null && i2 != null) || (!i1.equals(i2));
    }

    public static double getNumberNullSafe(Double hours) {
        return hours != null? hours : 0;
    }
}
