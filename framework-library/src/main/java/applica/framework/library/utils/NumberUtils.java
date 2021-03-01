package applica.framework.library.utils;

import java.math.BigDecimal;
import java.math.RoundingMode;

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

    /**
     * Approssima per eccesso
     * @param value
     * @param places
     * @return
     */
    public static double round(double value, int places) {
        if (places < 0) throw new IllegalArgumentException();
        if (Double.isNaN(value) || value == 0) return 0;
        if (Double.isInfinite(value)) return value;

        BigDecimal bd = BigDecimal.valueOf(value);
        bd = bd.setScale(places, RoundingMode.HALF_DOWN);
        return bd.doubleValue();
    }
}
