package applica._APPNAME_.domain.utils;

import applica.framework.ApplicationContextProvider;
import applica.framework.library.options.OptionsManager;

public class SystemOptionsUtils {

    public static String getOption(String option) {
        return ApplicationContextProvider.provide().getBean(OptionsManager.class).get(option);
    }
}
