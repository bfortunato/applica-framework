package applica._APPNAME_.domain.utils;

import applica.framework.ApplicationContextProvider;
import applica.framework.library.utils.ErrorsUtils;

public class CustomErrorUtils extends ErrorsUtils {


    public static CustomErrorUtils getInstance() {
        return (CustomErrorUtils) ApplicationContextProvider.provide().getBean(ErrorsUtils.class);
    }

    @Override
    public String getMessage(String label) {
        return CustomLocalizationUtils.getInstance().getMessage(label);
    }
}
