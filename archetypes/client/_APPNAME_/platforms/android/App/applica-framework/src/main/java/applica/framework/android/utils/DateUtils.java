package applica.app.utils;

import org.springframework.util.StringUtils;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

/**
 * Created by antoniolovicario on 18/05/16.
 */
public class DateUtils {

    public static String differenceDate(Date d1, Date d2, String ago) {
        if (!StringUtils.hasLength(ago)) {
            ago = "fa";
        }
        long diff = d2.getTime() - d1.getTime();
        long diffSeconds = diff / 1000 % 60;
        long diffMinutes = diff / (60 * 1000) % 60;
        long diffHours = diff / (60 * 60 * 1000);
        long diffDays = diff / (60 * 60 * 1000 * 24);

        //se è passata più di una settimana
        if (diffDays > 7) {
            return toString(d1, ITALIA_DATE_FORMAT);
        }

        if (diffDays > 0 ) return String.format("%dg %s", (int) diffDays, ago);
        if (diffHours > 0 ) return String.format("%dh %s",(int) diffHours, ago);
        if (diffMinutes > 0 ) return String.format("%dm %s",(int) diffMinutes, ago);

        return String.format("%ds %s",(int) diffSeconds, ago);
    }
    public static final String DATE_FOR_VISIT =" EEE dd MMM - HH:mm";
    public static final String ONLY_HOURS ="HH:mm";
    public static final String DATE_WITH_HOURS ="dd-MM-yyyyHH:mm:ss";
    public static final String DATE ="yyyy-MM-dd";
    public static final String POST_DATE_FORMAT = "dd MMMM yyyy"; //Es: 20 Gennaio 2016
    public static final String EVENT_DATE_FORMAT = "EEE dd MMM yyyy '-' HH:mm";
    public static final String ITEM_EVENT_DATE_FORMAT = "EEE dd MMM";
    public static final String ITALIA_DATE_FORMAT = "dd/MM/yyyy";
    public static final String ITALIA_DATE_FORMAT_WITH_HOURS = "dd/MM/yyyy, HH:mm";
    public static final String DATE_FOR_POST = "dd MMM yyyy 'alle' HH:mm";
    public static final String ONLY_DAY = "dd MMMM";
    public static final String DATE_FOR_PROFILE = "dd/MM/yyyy";

    private static String pattern;

    public static String toString(Date date, String pattern) {
        return new SimpleDateFormat(StringUtils.hasLength(pattern) ? pattern : DATE_WITH_HOURS).format(date);
    }

    public static String toString(Date date) {
        return toString(date, DATE_WITH_HOURS);
    }

    private static String getCurrentPattern() {
        //ottiene il pattern corrente , se settato... in caso contrario, utilizza un valore di default
        if (StringUtils.hasLength(pattern)) {
            pattern = DATE_WITH_HOURS;
        }
        return pattern;
    }

    public static Date toDate(String s, String pattern) {
        DateFormat format = new SimpleDateFormat(StringUtils.hasLength(pattern) ? pattern : DATE_WITH_HOURS);

        Date d = null;
        try {
            d = format.parse(s);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return d;
    }

    public static Date toDate(String s) {
        return toDate(s,DATE_WITH_HOURS);
    }

    /**
     * add days to date in java
     * @param date
     * @param days
     * @return
     */
    public static Date addDays(Date date, int days) {
        GregorianCalendar cal = new GregorianCalendar();
        cal.setTime(date);
        cal.add(Calendar.DATE, days);
        return cal.getTime();
    }


    public static String daysAgo(Date date){
        Date today = new Date();
        String output = "";
        int daysAgo = daysBetween(date, today);
        if(daysAgo > 0){
            output = String.valueOf(daysAgo) + "g";
        }else{
            int hoursAgo = hoursDifference(date, today);
            if(hoursAgo<0) { hoursAgo*=-1; }
            if(hoursAgo > 0 ){

                output = String.valueOf(hoursAgo) + "h";
            }else{
                int minutesAgo = minutesDiff(date, today);
                if(minutesAgo < 0) { minutesAgo*=-1; }
                output = String.valueOf(minutesAgo) + "m";
            }


        }
        return output;
    }

    public static int daysBetween(Date d1, Date d2){
        return (int)( (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    }

    public static int minutesDiff(Date earlierDate, Date laterDate)
    {
        if( earlierDate == null || laterDate == null ) return 0;

        return (int)((laterDate.getTime()/60000) - (earlierDate.getTime()/60000));
    }
    private static int hoursDifference(Date date1, Date date2) {

        final int MILLI_TO_HOUR = 1000 * 60 * 60;
        return (int) (date1.getTime() - date2.getTime()) / MILLI_TO_HOUR;
    }

    private static int minutesDifference(Date date1, Date date2) {
        final int MILLI_TO_MINUTES = 1000 * 60;
        return (int) (date1.getTime() - date2.getTime()) / MILLI_TO_MINUTES;
    }


    public static long dateDiff(Date start , Date end){
        long diff = end.getTime()  - start.getTime();
        return diff;
    }

    /**
     * Restituisce true se la data ha un'orario compreso tra le 20 e le 23
     * @param date
     * @return
     */
    public static boolean isEveningDate(Date date) {
        Calendar cal = Calendar.getInstance(); //Create Calendar-Object
        cal.setTime(date);               //Set the Calendar to now
        int hour = cal.get(Calendar.HOUR_OF_DAY); //Get the hour from the calendar
        if(hour <= 23 && hour >= 20)              // Check if hour is between 8 am and 11pm
        {
            return true;
            // do whatever you want
        }
        return false;
    }

    /**
     * Restituisce true se la data ha un'orario compreso tra le 23 e le 8 del mattino
     * @param date
     * @return
     */
    public static boolean isNightDate(Date date) {
        Calendar cal = Calendar.getInstance(); //Create Calendar-Object
        cal.setTime(date);               //Set the Calendar to now
        int hour = cal.get(Calendar.HOUR_OF_DAY); //Get the hour from the calendar
        if(hour > 23 && hour < 8)              // Check if hour is between 8 am and 11pm
        {
            return true;
            // do whatever you want
        }
        return false;
    }

    public static Calendar getDateFromString(String stringDate, String pattern) {
        Date date = toDate(stringDate, pattern);
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        return calendar;
    }

    public static Date addHoursToDate(Date date, int hours) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.HOUR, calendar.get(Calendar.HOUR) + hours);
        return calendar.getTime();
    }

    public static Date getNextMonthDate() {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.MONTH, 1);
        return calendar.getTime();
    }

    /**
     * Mostra la data nel formato HH:mm se sentDate <= new Date(), dd/mm/yyyy, HH:mm in caso contrario
     * @param sentDate
     * @return
     */
    public static String getDateForChat(Date sentDate) {

        if (!hasSameYear(sentDate, new Date()))
            return toString(sentDate, ITALIA_DATE_FORMAT_WITH_HOURS);

        if (!sentDate.after(getStartOfTheDay(new Date())))
            return toString(sentDate, DATE_FOR_VISIT);

        return toString(sentDate, ONLY_HOURS);

    }

    public static String getDateForEvent(Date sentDate) {

        if (!hasSameYear(sentDate, new Date()))
            return toString(sentDate, POST_DATE_FORMAT);

        if (!sentDate.after(getStartOfTheDay(new Date())))
            return toString(sentDate, ITEM_EVENT_DATE_FORMAT);

        return toString(sentDate, ITEM_EVENT_DATE_FORMAT);

    }

    private static boolean hasSameYear(Date sentDate, Date date) {
        Calendar c1 = Calendar.getInstance();
        c1.setTime(sentDate);

        Calendar c2 = Calendar.getInstance();
        c2.setTime(date);
        return c1.get(Calendar.YEAR) == c2.get(Calendar.YEAR);
    }

    public static Date getStartOfTheDay(Date day) {
        Calendar toDate = GregorianCalendar.getInstance();
        toDate.setTime(day);
        toDate.set(GregorianCalendar.HOUR_OF_DAY, 0);
        toDate.set(GregorianCalendar.MINUTE, 0);
        toDate.set(GregorianCalendar.SECOND, 0);

        return toDate.getTime();
    }

    public static Date getEndOfTheDay(Date day) {
        Calendar toDate = GregorianCalendar.getInstance();
        toDate.setTime(day);
        toDate.set(GregorianCalendar.HOUR_OF_DAY, 23);
        toDate.set(GregorianCalendar.MINUTE, 59);
        toDate.set(GregorianCalendar.SECOND, 59);

        return toDate.getTime();
    }

    public static String toString(long milliSeconds, String dateFormat)
    {
        // Create a DateFormatter object for displaying date in specified format.
        SimpleDateFormat formatter = new SimpleDateFormat(dateFormat);

        // Create a calendar object that will convert the date and time value in milliseconds to date.

        return formatter.format(getDateFromMillis(milliSeconds));
    }

    public static Date getDateFromMillis(long milliSeconds) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(milliSeconds);
        return calendar.getTime();
    }

    public static boolean isInCurrentDay(Date date) {
        return getDateWithOnlyDay(date).equals(getDateWithOnlyDay(new Date()));

    }
    /**
     * Inizializza l'oggetto calendar in modo che il primo giorno della settimana corrisponda a quello parametrizzato (magari spostarlo nelle properties)
     * @param date
     * @return
     */
    public static Calendar getCalendarInstance(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date != null ? date : new Date());
        calendar.setFirstDayOfWeek(Calendar.MONDAY);
        return calendar;
    }

    public static Date getDateWithOnlyDay(Date date) {
        Calendar calendar = getCalendarInstance(date);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar.getTime();
    }

}
