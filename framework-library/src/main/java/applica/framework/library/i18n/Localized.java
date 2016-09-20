package applica.framework.library.i18n;

import applica.framework.ApplicationContextProvider;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 5/17/13
 * Time: 10:06 AM
 */

/**
 * Inerith from this class gives the possibility to use translation system in application
 */
public class Localized {

    private Localization localization;

    protected Localization getLocalization() {
        if(localization == null) {
            localization = new Localization(ApplicationContextProvider.provide());
        }

        return localization;
    }

}
