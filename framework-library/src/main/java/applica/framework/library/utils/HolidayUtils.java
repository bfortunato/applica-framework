package applica.framework.library.utils;


import java.text.SimpleDateFormat;
import java.util.*;

public class HolidayUtils {

    public static boolean isItalianHoliday(Date date) {
        return isItalianHoliday(date, false, false);
    }

    public static boolean isItalianHoliday(Date date, boolean saturdayHoliday, boolean sundayHoliday) {
        Calendar cal = GregorianCalendar.getInstance();
        cal.setTime(date);
        int inputDayOfMonth = cal.get(GregorianCalendar.DAY_OF_MONTH);
        int inputMonth = cal.get(GregorianCalendar.MONTH);

        List<Date> holidays = getItalianHolidays(null);

        int holidayDayOfMonth = 0;
        int holidayMonth = 0;
        Calendar hol = GregorianCalendar.getInstance();

        //Controllo se domenica
        if (saturdayHoliday && cal.get(Calendar.DAY_OF_WEEK) == Calendar.SATURDAY) {
            return true;
        }

        //Controllo sabato
        if (sundayHoliday && cal.get(Calendar.DAY_OF_WEEK) == Calendar.SUNDAY) {
            return true;
        }

        //controllo pasqua/pasquetta
        if (isEaster(date) || isEasterMonday(date)) {
            return true;
        }

        for (Date holiday : holidays) {

            hol.setTime(holiday);
            holidayDayOfMonth = hol.get(GregorianCalendar.DAY_OF_MONTH);
            holidayMonth = hol.get(GregorianCalendar.MONTH);

            //Controllo festa comandata
            if (inputDayOfMonth == holidayDayOfMonth && inputMonth == holidayMonth) {
                return true;
            }
        }

        return false;
    }

    public static List<Date> getWorkingDaysInRange(Date startDate, Date endDate, boolean saturdayHoliday, boolean sundayHoliday) {

        List<Date> dates = DateUtils.getDaysBetweenRange(startDate, endDate);
        dates.removeIf(d -> isItalianHoliday(d, saturdayHoliday, sundayHoliday));
        return dates;
    }

    public static String getFutureEasterDateString(int years) {
        String ret = "";
        Calendar calendar = GregorianCalendar.getInstance();

        calendar.setTime(new Date());
        int year = calendar.get(Calendar.YEAR);
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");

        for (int i = 0; i < years; i++) {
            if (i == 0)
                ret = ret + sdf.format(findEaster(year)) + ",";
            else {
                year++;
                calendar.set(Calendar.YEAR, year);
                ret = ret + sdf.format(findEaster(year)) + ",";
            }
        }

        ret = ret.substring(0, ret.length() - 1);

        return ret;
    }

    public static String getFutureEasterMondaysDateString(int years) {
        String ret = "";
        Calendar calendar = GregorianCalendar.getInstance();

        calendar.setTime(new Date());
        int year = calendar.get(Calendar.YEAR);
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");

        for (int i = 0; i < years; i++) {
            if (i == 0)
                ret = ret + sdf.format(findEasterMonday(year)) + ",";
            else {
                year++;
                ret = ret + sdf.format(findEasterMonday(year)) + ",";
            }
        }

        ret = ret.substring(0, ret.length() - 1);
        return ret;
    }

    public static String getEasterDateString() {

        Calendar calendar = GregorianCalendar.getInstance();
        calendar.setTime(new Date());

        int year = calendar.get(Calendar.YEAR);

        Date easter = findEaster(year);

        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");

        return sdf.format(easter);

    }

    public static String getEasterMondayDateString() {

        Calendar calendar = new GregorianCalendar();
        calendar.setTime(new Date());

        int year = calendar.get(Calendar.YEAR);

        Date easterMonday = findEasterMonday(year);

        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");

        return sdf.format(easterMonday);
    }

    /**
     * Ottiene una lista di festività per gli anni passati come parametro
     *
     * @param pattern
     * @param years
     * @return
     */
    public static List<String> getItalianHolidaysStringified(String pattern, List<Integer> years) {
        List<Date> dates = new ArrayList<>();
        if (years != null && years.size() > 0) {
            for (Integer integer : years) {
                dates.addAll(getItalianHolidays(integer));
                //il metodo non restituisce anche pasqua/pasquetta: le calcolo a parte e le aggiungo
                dates.add(findEasterMonday(integer));
                dates.add(findEaster(integer));
            }

        } else {
            dates = getItalianHolidays(null);
            dates.add(findEasterMonday(Calendar.getInstance().get(Calendar.YEAR)));
            dates.add(findEaster(Calendar.getInstance().get(Calendar.YEAR)));

        }
        return stringifyDates(dates, pattern);

    }

    public static List<String> stringifyDates(List<Date> dates, String pattern) {
        List<String> datesToString = new ArrayList<>();
        SimpleDateFormat sdf = new SimpleDateFormat(pattern);
        dates.forEach(d -> datesToString.add(sdf.format(d)));
        return datesToString;
    }

    public static List<Date> getItalianHolidays(Integer year) {
        List<Date> ret = new ArrayList<Date>();
        int currentYear;
        if (year == null) {
            Calendar now = Calendar.getInstance();
            currentYear = now.get(Calendar.YEAR);
        } else {
            currentYear = year;
        }

        Calendar festa = GregorianCalendar.getInstance();
        //Capodanno
        festa.set(currentYear, 0, 1);
        ret.add(festa.getTime());
        //Epifania
        festa.set(currentYear, 0, 6);
        ret.add(festa.getTime());
        //Festa della liberazione
        festa.set(currentYear, 3, 25);
        ret.add(festa.getTime());
        //Festa dei lavoratori
        festa.set(currentYear, 4, 1);
        ret.add(festa.getTime());
        //Festa della repubblica italiana
        festa.set(currentYear, 5, 2);
        ret.add(festa.getTime());
        //Ferragosto
        festa.set(currentYear, 7, 15);
        ret.add(festa.getTime());
        //Ognissanti
        festa.set(currentYear, 10, 1);
        ret.add(festa.getTime());
        //Immacolata Concezione
        festa.set(currentYear, 11, 8);
        ret.add(festa.getTime());
        //Natale
        festa.set(currentYear, 11, 25);
        ret.add(festa.getTime());
        //Santo Stefano
        festa.set(currentYear, 11, 26);
        ret.add(festa.getTime());

        return ret;

    }

    public static boolean isEaster(Date date) {

        Calendar calendar = new GregorianCalendar();
        calendar.setTime(date);

        int year = calendar.get(Calendar.YEAR);
        int dateYMD = year * 10000 +
                calendar.get(Calendar.MONTH) * 100 +
                calendar.get(Calendar.DAY_OF_MONTH);
        Date easter = findEaster(year);
        calendar.setTime(easter);
        int easterYMD = year * 10000 +
                calendar.get(Calendar.MONTH) * 100 +
                calendar.get(Calendar.DAY_OF_MONTH);
        return (easterYMD == dateYMD);
    }

    public static boolean isEasterMonday(Date date) {

        Calendar calendar = new GregorianCalendar();
        calendar.setTime(date);

        int year = calendar.get(Calendar.YEAR);
        int dateYMD = year * 10000 +
                calendar.get(Calendar.MONTH) * 100 +
                calendar.get(Calendar.DAY_OF_MONTH);
        Date easter = findEaster(year);
        calendar.setTime(easter);
        calendar.add(Calendar.DATE, 1);
        int easterYMD = year * 10000 +
                calendar.get(Calendar.MONTH) * 100 +
                calendar.get(Calendar.DAY_OF_MONTH);
        return (easterYMD == dateYMD);
    }


    private static Date findEaster(int year) {

        int a = year % 19;
        int b = year % 4;
        int c = year % 7;

        int m = 0;
        int n = 0;

        if ((year >= 1583) && (year <= 1699)) {
            m = 22;
            n = 2;
        }
        if ((year >= 1700) && (year <= 1799)) {
            m = 23;
            n = 3;
        }
        if ((year >= 1800) && (year <= 1899)) {
            m = 23;
            n = 4;
        }
        if ((year >= 1900) && (year <= 2099)) {
            m = 24;
            n = 5;
        }
        if ((year >= 2100) && (year <= 2199)) {
            m = 24;
            n = 6;
        }
        if ((year >= 2200) && (year <= 2299)) {
            m = 25;
            n = 0;
        }
        if ((year >= 2300) && (year <= 2399)) {
            m = 26;
            n = 1;
        }
        if ((year >= 2400) && (year <= 2499)) {
            m = 25;
            n = 1;
        }

        int d = (19 * a + m) % 30;
        int e = (2 * b + 4 * c + 6 * d + n) % 7;

        Calendar calendar = new GregorianCalendar();
        calendar.set(Calendar.YEAR, year);

        if (d + e < 10) {
            calendar.set(Calendar.YEAR, year);
            calendar.set(Calendar.MONTH, Calendar.MARCH);
            calendar.set(Calendar.DAY_OF_MONTH, d + e + 22);
        } else {
            calendar.set(Calendar.MONTH, Calendar.APRIL);
            int day = d + e - 9;
            if (26 == day) {
                day = 19;
            }
            if ((25 == day) && (28 == d) && (e == 6) && (a > 10)) {
                day = 18;
            }
            calendar.set(Calendar.DAY_OF_MONTH, day);
        }

        return calendar.getTime();
    }

    private static Date findEasterMonday(int year) {

        Calendar inputCalendar = GregorianCalendar.getInstance();

        Date ret = findEaster(year);

        inputCalendar.setTime(ret);
        inputCalendar.add(Calendar.DAY_OF_MONTH, 1);

        return inputCalendar.getTime();

    }

    public static List<Date> generateItalianHolidays(Date start, Date end) {
        Calendar first = Calendar.getInstance();
        first.setTime(start);

        List<Date> holidays = getItalianHolidays(first.get(Calendar.YEAR));

        Calendar last = Calendar.getInstance();
        first.setTime(end);
        if (last.get(Calendar.YEAR) != first.get(Calendar.YEAR)) {
            holidays.addAll(getItalianHolidays(last.get(Calendar.YEAR)));
        }

        holidays.removeIf(d -> d.before(start) || d.after(end));
        return holidays;
    }

}
