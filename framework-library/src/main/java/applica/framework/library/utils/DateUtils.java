package applica.framework.library.utils;

import org.springframework.util.StringUtils;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.TimeUnit;

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
    public static final int DEFAULT_FIRST_DAY_OF_WEEK = Calendar.MONDAY;

    //FORMATI DATA
    public static final String FORMAT_DATE_DATEPICKER = "dd/MM/yyyy";
    public static final String FORMAT_QUESTBASE = "yyyy-MM-dd'T'HH:mm:ss";
    public static final String FORMAT_TIME_HUMAN = "HH:mm";
    public static final String FORMAT_DATE_CALENDAR = "yyyy-MM-dd";
    public static final String FORMAT_DATE_DATEPICKER_WITH_HOURS = "dd/MM/yyyy HH:mm";
    public static final String FORMAT_DATE_CALENDAR_WITH_HOURS = "yyyy-MM-dd HH:mm";
    public static final String FORMAT_DATE_LETTERAL_MONTH = "dd MMMM yyyy";
    public static final String FORMAT_DATE_PIANO = "MMMM_yyyy";
    public static final String FORMAT_DATE_MONTH = "MM_yyyy";
    public static final String FORMAT_ONLY_MONTH = "MM/yyyy";
    public static final String FORMAT_YEAR_TWO_DIGITS = "yy";
    public static final String FORMAT_MONTH_TWO_DIGITS = "MM";

    public static final int WORKING_DAY_HOURS = 8;


    public static int getCurrentYear() {
        Calendar cal = GregorianCalendar.getInstance();
        return cal.get(Calendar.YEAR);
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
        calendar.setFirstDayOfWeek(DEFAULT_FIRST_DAY_OF_WEEK);
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

    public static Date getEndOfTheDay(Date day) {
        Calendar toDate = GregorianCalendar.getInstance();
        toDate.setTime(day);
        toDate.set(GregorianCalendar.HOUR_OF_DAY, 23);
        toDate.set(GregorianCalendar.MINUTE, 59);
        toDate.set(GregorianCalendar.SECOND, 59);

        return toDate.getTime();
    }

    public static Date getBeginOfTheDay(Date day) {

        Calendar fromDate = GregorianCalendar.getInstance();
        fromDate.setTime(day);
        fromDate.set(GregorianCalendar.HOUR_OF_DAY, 0);
        fromDate.set(GregorianCalendar.MINUTE, 0);
        fromDate.set(GregorianCalendar.SECOND, 0);

        return fromDate.getTime();
    }



    public static String getStringifyDate(Date date, String format) {
        if (date != null) {
            SimpleDateFormat sdf = new SimpleDateFormat(format);
            return sdf.format(date);
        }
        return null;
    }

    public static int getLastDayOfMonth(int month, int year) {

        Calendar date = new GregorianCalendar(year, month - 1, 1);
        //restituisce l'ultimo giorno di tale mese
        return date.getActualMaximum(Calendar.DAY_OF_MONTH);
    }

    public static Date getDateFromString(String stringDate, String format) throws ParseException {
        if (StringUtils.hasLength(stringDate)) {
            //format è il formato della data oggetto di parser; è bene tener traccia dei formati utilizzati tramite costanti presenti in questa classe
            DateFormat formatter = new SimpleDateFormat(format);
            formatter.setTimeZone(getDefaultTimezone());
            return formatter.parse(stringDate);
        }
        return null;
    }

    public static String getLastYearDate(int year) {
        //data massima selezionabile: l'ultimo giorno di Dicembre
        return String.format("31/12/%s", year);
    }


    public static String getFirstYearDay(int year) {
        //data minima selezionabile:il primo giorno di gennaio

        return String.format("01/01/%s", year);
    }

    public static void sortDateList(List<Date> list) {
        list.sort(new DateComparator()); }


    public static final String DAY_WITH_MONTH_DD_MMM = "dd MMM";
    public static final String TIME_DESCRIPTION_HH_MM = "hh:mm";
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

    public static String getStringFromDate(Date date, String format, Locale locale) {
        if (date == null)
            return "";

        SimpleDateFormat formatter = new SimpleDateFormat(format, locale);
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



    public static String getStringFromDate(Date date, String format) {
        if (date == null)
            return "";

        SimpleDateFormat formatter = new SimpleDateFormat(format, Locale.ITALIAN);
        return formatter.format(date);
    }

    public static int compareDates(Date date1, Date date2) {
        /*
        Attraverso il confronto di istanze di Calendar, e non Date, è possibile confrontare anche le ore ed i minuti di una data
         */
        Calendar dateCalendar1 = GregorianCalendar.getInstance();
        dateCalendar1.setTime(date1);
        Calendar dateCalendar2 = GregorianCalendar.getInstance();
        dateCalendar2.setTime(date2);
        return dateCalendar1.compareTo(dateCalendar2);
    }

    public static double getDifferencesInHours(Date start, Date end) {
        long startDateInMills = start.getTime();
        long endDateInMills = end.getTime();
        return (double) ((endDateInMills - startDateInMills) / (1000 * 60 * 60));

    }


    public static int getMonthNumber(Date date) {
        /*
        Ottiene il numero del mese (da 0 a 11) per la data passata
         */
        Calendar cal = getCalendarInstance(date);
        return cal.get(Calendar.MONTH); //in java i mesi partono da 0
    }

    /**
     * Calcola la differenza in mesi tra una data di inizio e fine, tenendo in considerazione anche l'appartenenza ad anni diversi
     * @param start
     * @param end
     * @return
     */
    public static int getDifferencesInMonths(Date start, Date end) {
        //restituisce 0 se le date sono nello stesso mese ma non sono l'inizio e la fine del mese

        if (getYearFromDate(end) == getYearFromDate(start) &&  getMonthFromDate(end) == getMonthFromDate(start)) {
            if (!(getMonthStartDate(start).equals(getBeginOfTheDay(start)) && getMonthEndDate(end).equals(getBeginOfTheDay(end))))
                return 0;
        }
        return  (getYearFromDate(end) - getYearFromDate(start)) * 12 + (getMonthFromDate(end) - getMonthFromDate(start)) + 1;
    }

    /**
     * Restituisce la differenza tra due date in giorni considerando anche la differenza di anno
     * @param start
     * @param end
     * @return
     */
    public static int getDifferencesInDays(Date start, Date end) {
        Calendar sDate = Calendar.getInstance();
        Calendar eDate = Calendar.getInstance();
        sDate.setTime(start);
        eDate.setTime(end);
        return (int) ChronoUnit.DAYS.between(sDate.toInstant(), eDate.toInstant());
    }



    private static int getMonthFromDate(Date end) {
        Calendar calendar = getCalendarInstance(end);
        return calendar.get(Calendar.MONTH);
    }

    private static int getYearFromDate(Date end) {
        Calendar calendar = getCalendarInstance(end);
        return calendar.get(Calendar.YEAR) - 1900;
    }


    public static int[] calendarDays(boolean inverse) {
        if (inverse)
            return new int[]{Calendar.SUNDAY, Calendar.SATURDAY, Calendar.FRIDAY, Calendar.THURSDAY, Calendar.WEDNESDAY, Calendar.TUESDAY, Calendar.MONDAY};

        return new int[]{Calendar.MONDAY, Calendar.TUESDAY, Calendar.WEDNESDAY, Calendar.THURSDAY, Calendar.FRIDAY, Calendar.SATURDAY, Calendar.SUNDAY};

    }


    public static boolean isFirstWorkingDayOfCurrentWeek(Date date) {
        Calendar calendar = getCalendarInstance(date);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);

        Calendar weekStartDate = getCalendarInstance(getWeekStartDate(new Date()));
        weekStartDate.set(Calendar.SECOND, 0);
        weekStartDate.set(Calendar.MILLISECOND, 0);
        weekStartDate.set(Calendar.HOUR_OF_DAY, 0);
        weekStartDate.set(Calendar.MINUTE, 0);
        while (HolidayUtils.isItalianHoliday(weekStartDate.getTime())) {
            weekStartDate.add(Calendar.DAY_OF_MONTH, 1);
        }



        return calendar.getTime().compareTo(weekStartDate.getTime()) == 0;
    }

    //Ottiene la data di inizio della settimana cche comprende la data corrente; in caso di mese spezzato devo considerare la prima data utile nel mese corrente
    public static Date getWeekStartDate(Date date) {
        return getWeekMargins(date, false, true);
    }

    //Ottiene la data di inizio della settimana cche comprende la data corrente; in caso di mese spezzato devo considerare la prima data utile nel mese corrente
    public static Date getWeekEndDate(Date date) {
        return getWeekMargins(date, true, true);
    }


    /**
     * Ottiene gli estremi della settimana (primo o ultimo giorno); è possibile indicare il tipo di settimana (solare o appartenente allo stesso mese)
     * @param date
     * @param inverse indica il verso in cui considerare l'estremo della settimana (false è il primo, true l'utimo)
     * @param sameMonth false = settmana solare ( dal primo all'ultimo giorno), true = settimana spezzata dal mese
     * @return
     */
    private static Date getWeekMargins(Date date, boolean inverse, boolean sameMonth) {
        //data attuale
        Calendar calendar = getCalendarInstance(date);
        calendar.setFirstDayOfWeek(Calendar.MONDAY);
        calendar.setTime(date);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);

        Calendar dayToFind = getCalendarInstance(date);
        dayToFind.setTime(date);
        dayToFind.set(Calendar.SECOND, 0);
        dayToFind.set(Calendar.MILLISECOND, 0);
        dayToFind.set(Calendar.HOUR_OF_DAY, 0);
        dayToFind.set(Calendar.MINUTE, 0);
        int [] days = calendarDays(inverse);
        if (sameMonth) {
            for (int day : days) {
                dayToFind.set(Calendar.DAY_OF_WEEK, day);
                if (dayToFind.get(Calendar.MONTH) != calendar.get(Calendar.MONTH))
                    continue;
                else {
                    //ho trovato la mia data!
                    break;
                }
            }
        } else {
            dayToFind.set(Calendar.DAY_OF_WEEK, days[0]);
        }

        return dayToFind.getTime();
    }

    //Ottiene la data di inizio del mese che comprende la data corrente;in caso di mese spezzato devo considerare la prima data utile nel mese corrente
    public static Date getMonthStartDate(Date date) {

        Calendar calendar = getCalendarInstance(date);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.DAY_OF_MONTH, Calendar.getInstance().getActualMinimum(Calendar.DAY_OF_MONTH));
        return calendar.getTime();

    }

    private static Calendar getCalendarMonthEndDate(Date date) {
        Calendar calendar = getCalendarInstance(date);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.DAY_OF_MONTH, getCalendarInstance(date).getActualMaximum(Calendar.DAY_OF_MONTH));
        return calendar;

    }

    //Ottiene la data di inizio della settimana cche comprende la data corrente
    public static Date getMonthEndDate(Date date) {
        return getCalendarMonthEndDate(date).getTime();
    }

    public static Date getNextMonthEndDate(Date date) {
        Calendar c = getCalendarInstance(getMonthStartDate(date));
        c.add(Calendar.MONTH, 1);
        return getMonthEndDate(c.getTime());
    }


    public static String getDescriptionByDayCode(int dayNumber) {
        switch (dayNumber) {
            case Calendar.MONDAY:
                return "Lunedì";
            case Calendar.THURSDAY:
                return "Giovedi";
            case Calendar.WEDNESDAY:
                return "Mercoledi";
            case Calendar.TUESDAY:
                return "Martedì";
            case Calendar.FRIDAY:
                return "Venerdi";
            case Calendar.SATURDAY:
                return "Sabato";
            case Calendar.SUNDAY:
                return "Domenica";

        }
        return "";
    }

    public static String getDescriptionByMonthCode(int month){

        String s = "N/A";

        switch (month){

            case 0:
                s = "Gennaio";
                break;

            case 1:
                s = "Febbraio";
                break;

            case 2:
                s = "Marzo";
                break;

            case 3:
                s = "Aprile";
                break;

            case 4:
                s = "Maggio";
                break;

            case 5:
                s = "Giugno";
                break;

            case 6:
                s = "Luglio";
                break;

            case 7:
                s = "Agosto";
                break;

            case 8:
                s = "Settembre";
                break;

            case 9:
                s = "Ottobre";
                break;

            case 10:
                s = "Novembre";
                break;

            case 11:
                s = "Dicembre";
                break;

        }

        return s;

    }

    //Ottiene il numero dell'ultimo giorno del mese corrente
    public static int getLastDayMonthNumber(Date date) {
        Calendar calendar = getCalendarInstance(date);
        return calendar.getActualMaximum(Calendar.DAY_OF_MONTH);
    }

    //Ottiene il numero di giorni mancanti per raggiungere l'ultimo giorno del mese della data passata in input
    public static int getRelativeEndDateNumber(Date date) {
        Calendar calendar = getCalendarInstance(date);
        return getLastDayMonthNumber(date) - calendar.get(Calendar.DAY_OF_MONTH);
    }

    //Ottiene il numero di giorni mancanti per raggiungere l'ultimo giorno del mese succesivodella data passata in input
    public static int getRelativeNextEndDateNumber(Date date) {
        Calendar calendar = getCalendarInstance(getMonthStartDate(date));
        calendar.add(Calendar.MONTH, 1);
        //somma al numero di giorni necesasri per finire il mese corrente al numero di giorni del mese successivo
        return getLastDayMonthNumber(calendar.getTime()) + getRelativeEndDateNumber(date);
    }

    //Restituisce true se date è compresa in startDate ed endDate, false altrimenti
    public static boolean isDateInRange(Date date, Date startDate, Date endDate) {
        return date.compareTo(startDate) >= 0 && endDate.compareTo(date) >= 0;
    }

    //Ottiene il giorno che rappresenta la settimana successiva al giorno corrente, tenendo in conrsiderazione il mese che può "spezzarla"
    public static Date getNextWeekDay(Date date) {
        return getNextWeekDay(date, true);
    }

    private static Date getNextWeekDay(Date date, boolean sameMonth) {
        //cicla in avanti finchè non trova un giorno di mese diverso oppure di diversa settimana

        //Data riferimento
        Calendar calendar = getCalendarInstance(date);

        Calendar dayToFound = getCalendarInstance(date);
        boolean found = false;
        while (!found) {
            dayToFound.add(Calendar.DATE, 1);
            //se il successivo giorno rispetto a quello corrente è di un mese / settimana diverso -> è il primo giorno da considerare
            if (calendar.get(Calendar.WEEK_OF_MONTH) != dayToFound.get(Calendar.WEEK_OF_MONTH) || (sameMonth && calendar.get(Calendar.MONTH) != dayToFound.get(Calendar.MONTH))) {
                found = true;
            } else {
                continue;
            }

        }
        return dayToFound.getTime();
    }


    public static Date getPreviousWeekDay(Date date) {
        return getPreviousWeekDay(date, true);
    }

    //Ottiene il giorno che rappresenta la settimana precedente al giorno corrente, tenendo in considerazione il mese che può "spezzarla"
    private static Date getPreviousWeekDay(Date date, boolean sameMonth) {
        //cicla indietro finchè non trova un giorno di mese diverso oppure di diversa settimana

        //Data riferimento
        Calendar calendar = getCalendarInstance(date);

        Calendar dayToFound = getCalendarInstance(date);
        boolean found = false;
        while (!found) {
            dayToFound.add(Calendar.DATE, -1);
            //se il successivo giorno rispetto a quello corrente è di un mese / settimana diverso -> è il primo giorno da considerare
            if (calendar.get(Calendar.WEEK_OF_MONTH) != dayToFound.get(Calendar.WEEK_OF_MONTH) || (sameMonth && calendar.get(Calendar.MONTH) != dayToFound.get(Calendar.MONTH))) {
                found = true;
            } else {
                continue;
            }

        }
        return dayToFound.getTime();
    }


    /**
     * Restituisce, a partire da un decimale che rappresenta le ore una stringa di tipo HH:mm
     *
     * @param hours
     * @return HH:mm
     */
    public static String fromMinutesToTime(Double hours) {

        if (hours == null) {
            return "00:00";
        }
        int maxSeconds = 60;
        String[] s = (Double.toString(hours)).split("\\.");
        String hh = s[0];
        if (Math.floor(hours) < 10) {
            hh = "0" + hh;
        }
        double decimal = hours - Math.floor(hours);
        long m = Math.round(decimal * maxSeconds);
        String mm = Long.toString(m);
        if (m < 10) {
            mm = "0" + mm;
        }

        return hh + ":" + mm;
    }

    //ottiene tutti gli inizi settimana del mese contentente la data "date"
    public static List<Date> getAllMonthWeekStarts(Date date) {
        List<Date> dates = new ArrayList<>();
        //ottengo la data di inizio mese che comprende 'date'
        Date monthDate = getMonthStartDate(date);
        Calendar calendar = getCalendarInstance(monthDate);
        Calendar toFind = getCalendarInstance(monthDate);

        //Ciclo sulle date di settimana in settimana,finchè resto nel mese corrente
        while (calendar.get(Calendar.MONTH) == toFind.get(Calendar.MONTH)) {
            dates.add(toFind.getTime());
            toFind = getCalendarInstance(getNextWeekDay(toFind.getTime()));
        }

        return dates;
    }


    //Restituisce true se il mese ed il giorno delle date in questione sono uguali
    public static boolean dayAndMonthEquals(Date date1, Date date2) {
        Calendar calendar1 = getCalendarInstance(date1);
        Calendar calendar2 = getCalendarInstance(date2);
        return calendar1.get(Calendar.MONTH) == calendar2.get(Calendar.MONTH) && calendar2.get(Calendar.DAY_OF_MONTH) == calendar1.get(Calendar.DAY_OF_MONTH);
    }

    public static boolean yearAndMonthEqual(Date date1, Date date2) {
        Calendar calendar1 = getCalendarInstance(date1);
        Calendar calendar2 = getCalendarInstance(date2);
        return calendar1.get(Calendar.MONTH) == calendar2.get(Calendar.MONTH) && calendar2.get(Calendar.YEAR) == calendar1.get(Calendar.YEAR);

    }

    //effettua il parse di una data in formato dd/mm e la trasforma in un oggetto date dd/mm/yyyy (anno corrente)
    public static Date getDateFromMonthAndDay(String date) {
        try {
            String[] s = date.split("/");
            Calendar calendar = Calendar.getInstance();
            calendar.set(Calendar.MONTH, Integer.parseInt(s[1]) - 1);
            calendar.set(Calendar.DAY_OF_MONTH, Integer.parseInt(s[0]));
            return calendar.getTime();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    //Restituisce un intero che rappresenta il numero della settimana a cui appartiene quella data nel mese corrente
    public static int getWeekNumberInMonth(Date date) {
        Calendar calendar = getCalendarInstance(date);
        Calendar first = getCalendarInstance(getMonthStartDate(date));
        int constantToAdd = 0;
        if (first.get(Calendar.WEEK_OF_MONTH) == 0) {
            constantToAdd = 1;
        }
        return calendar.get(Calendar.WEEK_OF_MONTH) + constantToAdd;
    }


    /**
     * Calcola il numero di giorni corrispondenti al parametro hours; viene passato il parametro hoursInDays perchè potrei considerare
     * un giorno come lavorativo (8h) oppure solare (24h)
     * @param hoursInDay
     * @param hours
     * @return
     */
    public static double getDaysFromHours(double hoursInDay,double hours) {
        return Math.floor(hours / hoursInDay * 1000) / 1000;
    }

    public static TimeZone getDefaultTimezone() {
        return TimeZone.getTimeZone("CET");
    }

    /*
    Ottiene la lista dei giorni della settimana che comprende date, considerando anche le settimane "spezzate" dalla fine di un mese
     */
    public static List<Date> getDaysOfWeek(Date date) {
        Calendar day = getCalendarInstance(date);
        List<Date> dayOfWeeks = new ArrayList<>();
        for (int dayNumber : calendarDays(false)) {

            Calendar weekDay = getCalendarInstance(date);
            weekDay.set(Calendar.DAY_OF_WEEK, dayNumber);
            //se una settimana è a cavallo di un mese devo "spezzarla"...
            if (day.get(Calendar.MONTH) == weekDay.get(Calendar.MONTH)) {
                dayOfWeeks.add(weekDay.getTime());
            } else {
                //cicla al successivo giorno... considererà solo i giorni nello stesso mese
            }
        }
        return dayOfWeeks;
    }

    public static List<Date> getDaysOfMonth(Date date) {
        Date firstDayOfMonth = getMonthStartDate(date);
        Calendar first = getCalendarInstance(firstDayOfMonth);
        Calendar day = getCalendarInstance(firstDayOfMonth);

        List<Date> dates = new ArrayList<>();
        while (day.get(Calendar.MONTH) == first.get(Calendar.MONTH)) {
            dates.add(day.getTime());
            day.add(Calendar.DAY_OF_MONTH, 1);
        }
        return dates;
    }

    //Ottiene l'n-esimo giorno prima della fine del mese che comprende date
    public static Date getDayBeforeEndOfMonth(Date date, int dayBeforeEnd) {
        Calendar calendar = getCalendarMonthEndDate(date);
        return getPreviousDay(calendar.getTime(), dayBeforeEnd);
    }

    public static Date getPreviousDay(Date date, int n) {
        Calendar calendar = getCalendarInstance(date);
        calendar.add(Calendar.DAY_OF_MONTH, -1 * n);
        return calendar.getTime();
    }

    public static boolean isSpecificDayOfWeek(Date date, int day) {
        Calendar calendar = getCalendarInstance(date);
        return calendar.get(Calendar.DAY_OF_WEEK) == day;
    }

    //Data una lista di date, restituisce la lista di tutte le date di inizio delle settimane che comprendono quelle della lista
    public static List<Date> getAllMonthWeekStartsFromDates(List<Date> dates) {
        Map<Long, Date> weekStarts = new HashMap<>();
        for (Date date: dates) {
            weekStarts.put(date.getTime(), getWeekStartDate(date));
        }
        return new ArrayList<>(weekStarts.values());
    }

    /**
     * Ottiene una lista di anni vicini rispetto alla data odierna in un intorno del tipo [annoAttuale - value, annoAttuale + value]
     * @return
     */
    public static List<Integer> getNearYears(int value){
        Calendar calendar = getCalendarInstance(new Date());

        int currentYear = calendar.get(Calendar.YEAR);
        List<Integer> years = new ArrayList<>();
        int start = currentYear - value;
        int end = currentYear + value;
        while (start <= end) {
            years.add(start);
            start++;
        }
        return years;

    }

    public static int getWeekNumberInYear(Date date) {
        Calendar calendar = getCalendarInstance(date);
        return calendar.get(Calendar.WEEK_OF_YEAR);
    }

    /**
     * Ottiene tutte le date comprese nell'intervallo startDate-endDate (estremi esclusi).
     * @param startDate
     * @param endDate
     * @return
     */
    public static List<Date> getDaysBetweenRange(Date startDate, Date endDate) {

        Calendar first = getCalendarInstance(startDate);
        Calendar last = getCalendarInstance(endDate);

        List<Date> dates = new ArrayList<>();
        while (first.getTime().compareTo(last.getTime()) <= 0) {
            dates.add(first.getTime());
            first.add(Calendar.DAY_OF_MONTH, 1);
        }
        return dates;
    }

    public static Date getPreviousMonthStartDate(Date date) {
        Calendar calendar = getCalendarInstance(date);
        if (calendar.get(Calendar.MONTH) == 0) {
            calendar.set(Calendar.YEAR, calendar.get(Calendar.YEAR) - 1);
            calendar.set(Calendar.MONTH, Calendar.DECEMBER);
        } else {
            calendar.add(Calendar.MONTH, -1);
        }
        return getMonthEndDate(calendar.getTime());
    }

    public static Date getPreviousDay(Date date) {
        Calendar calendar = getCalendarInstance(date);
        calendar.add(Calendar.DATE, -1);
        return calendar.getTime();
    }

    public static int getDayNumber(Date date) {

        Calendar calendar = getCalendarInstance(date);

        return calendar.get(Calendar.DAY_OF_MONTH);

    }

    public static int geYearNumber(Date date) {
        Calendar calendar = getCalendarInstance(date);
        return calendar.get(Calendar.YEAR);
    }

    public static Date getNextDay(Date date) {
        return getNextDay(date, 1);
    }
    public static Date getNextDay(Date date, int n) {
        Calendar calendar = getCalendarInstance(date);
        calendar.add(Calendar.DAY_OF_MONTH, n);
        return calendar.getTime();
    }

    public static Date getYearStartDate(Date date) {
        Calendar calendar = getCalendarInstance(date);
        calendar.set(Calendar.MONTH, Calendar.JANUARY);
        calendar.set(Calendar.DAY_OF_MONTH, 1);
        return calendar.getTime();
    }

    public static Date getDateFromMonthAndYear(String dateToString) {
        try {
            return StringUtils.hasLength(dateToString) ? getMonthEndDate(getDateFromString(dateToString, FORMAT_ONLY_MONTH)) : null;
        } catch (ParseException e) {
            return null;
        }
    }

    public static Date getPreviousYearStartDate(Date date) {
        Calendar calendar = getCalendarInstance(date);
        calendar.add(Calendar.YEAR, -1);
        return getYearStartDate(calendar.getTime());
    }

    public static List<Date> getAllMonthStartDatesInRange(Date startDate, Date endDate) {
        List<Date> dates = new ArrayList<>();
        if (startDate.compareTo(endDate) < 0) {
            Calendar end = getCalendarInstance(endDate);
            Calendar date = getCalendarInstance(startDate);
            do {
                dates.add(getMonthStartDate(date.getTime()));
                date.add(Calendar.MONTH, 1);

            } while (date.get(Calendar.MONTH) <= end.get(Calendar.MONTH));
        }
        return dates;
    }
}

class DateComparator implements Comparator<Date> {
    @Override
    public int compare(Date o1, Date o2) {
        return o1.compareTo(o2);

    }
}
