package applica.framework.library.i18n;

import applica.framework.ApplicationContextProvider;

import java.util.Locale;

public class LocalizationUtils {

    public static String getMessage(String code) {
        return getMessage(code, Locale.getDefault());
    }

    public static String getMessage(String code, Locale locale) {
        try {
            return ApplicationContextProvider.provide().getMessage(code, null, locale);
        } catch (Exception e) {
            return "";
        }
    }
}
