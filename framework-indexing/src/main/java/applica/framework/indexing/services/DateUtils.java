package applica.framework.indexing.services;

import java.util.Date;
import java.util.TimeZone;

public class DateUtils {
    public static Date addCurrentTimeZoneOffset(Date date) {
        if (date == null) {
            return null;
        }

        long delta = TimeZone.getDefault().getOffset(new Date().getTime());
        delta += date.getTime();

        return new Date(delta);
    }
}
