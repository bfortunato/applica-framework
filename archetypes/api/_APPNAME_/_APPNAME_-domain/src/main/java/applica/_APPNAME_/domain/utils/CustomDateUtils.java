package applica._APPNAME_.domain.utils;

import applica._APPNAME_.domain.model.localization.LocalizationManager;
import applica.framework.library.utils.DateUtils;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.concurrent.TimeUnit;

public class CustomDateUtils extends DateUtils {

    public static final String DAY_WITH_MONTH_DD_MMM = "dd MMM";
    public static final String TIME_DESCRIPTION_HH_MM = "hh:mm";
    public static final String TIME_DESCRIPTION_HH_MM_24 = "HH:mm";
    public static final String TIME_DESCRIPTION_MM_SS = "mm:ss";

    //Restituisce una stringa di tipo mm:ss a partire da  data di inizio e fine
    public static String getTimeDifferenceDescription(Date startDate, Date endDate) {
        if (startDate != null && endDate != null) {
            long millis = endDate.getTime() - startDate.getTime();
            return String.format("%02d:%02d",
                    TimeUnit.MILLISECONDS.toMinutes(millis),
                    TimeUnit.MILLISECONDS.toSeconds(millis) - TimeUnit.MINUTES.toSeconds(TimeUnit.MILLISECONDS.toMinutes(millis)));

        }
        return "";
    }
    /* */

    //Restituisce una stringa di tipo HH:mm a partire da minuti
    public static String getMinutesDescription(long minutes) {
        return String.format("%02d:%02d",
                TimeUnit.MINUTES.toHours(minutes),
                minutes - TimeUnit.HOURS.toMinutes( TimeUnit.MINUTES.toHours(minutes)));

    }
    
    public static String getStringFromDate(Date date, String format) {
        if (date == null)
            return "";

        SimpleDateFormat formatter = new SimpleDateFormat(format, LocalizationManager.getInstance().getCurrentLocale());
        return formatter.format(date);
    }


    public static long getDifferenceInMinutes(Date startDate, Date endDate) {
        if (startDate != null && endDate != null) {
            long diff = endDate.getTime() - startDate.getTime();
            return TimeUnit.MILLISECONDS.toMinutes(diff);
        }
        return 0;
    }

    public static Date addMinutesToDate(Date date, int mins) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.MINUTE, mins);
        return calendar.getTime();
    }

    /**
     * Definisce la data a partire dalla quale considerare un meeting in scadenza in base a quella passata come parametro
     * @param date
     * @return
     */
    public static Date getUpcomingMeetingStartDate(Date date) {
        Calendar c = Calendar.getInstance(LocalizationManager.getInstance().getCurrentLocale());
        c.setTime(date);
        c.add(Calendar.MINUTE, -30);
        c.add(Calendar.MILLISECOND, -1);
        return c.getTime();
    }

    public static Date addDaysToDate(Date date, int days) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DAY_OF_YEAR, days);
        return calendar.getTime();
    }

    public static long getDifferenceInSeconds(Date d1, Date d2) {
        return (d2.getTime()-d1.getTime())/1000;
    }
}
