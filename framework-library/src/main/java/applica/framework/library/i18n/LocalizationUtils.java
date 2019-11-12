package applica.framework.library.i18n;

import applica.framework.ApplicationContextProvider;

import java.util.Locale;

public class LocalizationUtils {

    public static LocalizationUtils getInstance() {
        return ApplicationContextProvider.provide().getBean(LocalizationUtils.class);
    }

    public String getLocalizedMessage(String code) {
        return getLocalizedMessage(code, Locale.getDefault());
    }

    public String getLocalizedMessage(String code, Locale locale) {
        try {
            return ApplicationContextProvider.provide().getMessage(code, null, locale);
        } catch (Exception e) {
            return code;
        }
    }

    public String getMessage(String code) {
        return ApplicationContextProvider.provide().getBean(LocalizationUtils.class).getLocalizedMessage(code);
    }
}
