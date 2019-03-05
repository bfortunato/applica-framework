package applica._APPNAME_.domain.utils;


import applica._APPNAME_.domain.model.localization.LocalizationManager;
import applica.framework.ApplicationContextProvider;
import applica.framework.library.i18n.LocalizationUtils;

import java.util.Locale;

public class CustomLocalizationUtils extends LocalizationUtils {

    public static CustomLocalizationUtils getInstance() {
        return (CustomLocalizationUtils) ApplicationContextProvider.provide().getBean(LocalizationUtils.class);
    }


    public String getMessage(String code) {
       return getMessage(code,  (String[]) null);
    }

    public String getMessage(String code, String... params) {
        return getMessage(code, LocalizationManager.getInstance().getCurrentLocale(), params);
    }

    public String getMessage(String code, Locale locale, String... params) {
        if (locale == null)
            locale = LocalizationManager.getInstance().getCurrentLocale();
        String message = getLocalizedMessage(code, locale);


        return params != null && params.length > 0? String.format(message, params) : message;
    }

}
