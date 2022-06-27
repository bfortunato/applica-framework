package applica.framework.indexing.services;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

public class DateUtils {

    private static DateFormat DATE_FORMAT() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd", Locale.ITALY);
        sdf.setTimeZone(TimeZone.getTimeZone("Europe/Rome"));
        return sdf;
    }

    public static String dateToString(Date value) {
        return DATE_FORMAT().format(value);
    }

    public static Object stringToDate(String stringValue) {
        try {
            return DATE_FORMAT().parse(stringValue);
        } catch (ParseException e) {
            //throw new RuntimeException(e);
            return null;
        }
    }
}
