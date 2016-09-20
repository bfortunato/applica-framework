package applica.framework.library.utils;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class DateUtils {

    public static boolean validate(Date date, String dateFormat) {

		/*String testDate;
		Date newDate;
		
		SimpleDateFormat formatter = new SimpleDateFormat(dateFormat);
		testDate = formatter.format(date);
		
		try {
			newDate = formatter.parse(testDate);
		} catch (ParseException e) {
			return false;
		}
		
		if (!newDate.equals(date)) 
	    {
	      return false;
	    }*/

        return true;
    }

    public static Date setDateFormat(Date date, String dateFormat) {

        Date dateFormatted = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat(dateFormat);

        try {
            dateFormatted = formatter.parse(formatter.format(date));
        } catch (ParseException e) {
            e.printStackTrace();
        }

        return dateFormatted;
    }

    public static Date getMinValueInDay(Date date) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.set(Calendar.HOUR_OF_DAY, 0);
        c.set(Calendar.MINUTE, 0);
        c.set(Calendar.SECOND, 0);
        c.set(Calendar.MILLISECOND, 0);
        return c.getTime();
    }

    public static Date getMaxValueInDay(Date date) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.set(Calendar.HOUR_OF_DAY, 23);
        c.set(Calendar.MINUTE, 59);
        c.set(Calendar.SECOND, 59);
        c.set(Calendar.MILLISECOND, 999);
        return c.getTime();
    }

    public static String toISO8601(Date date) {
        DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mmZ");
        return df.format(date);
    }
}
