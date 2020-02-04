package applica.framework.security.utils;

import applica.framework.ApplicationContextProvider;
import applica.framework.library.options.OptionsManager;

import java.util.Objects;

public class SystemOptionsUtils {

    public static final String OPTION_VALUE_ON = "ON";

    public static String getOption(String option) {
        return ApplicationContextProvider.provide().getBean(OptionsManager.class).get(option);
    }

    public static boolean isEnabled(String option) {
        return Objects.equals(getOption(option), OPTION_VALUE_ON);
    }
}
