package applica.framework.library.i18n.editors;

import applica.framework.ApplicationContextProvider;
import applica.framework.library.i18n.Localization;
import org.springframework.util.Assert;

import java.beans.PropertyEditorSupport;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 5/16/13
 * Time: 9:17 AM
 */
public class LocalizedDatePropertyEditor extends PropertyEditorSupport {

    private Localization localization;

    public void setAsText(String value) {
        try {
            setValue(new SimpleDateFormat(getLocalization().getMessage("format.date")).parse(value));
        } catch(ParseException e) {
            setValue(null);
        }
    }

    public String getAsText() {
        Date date = (Date)getValue();
        return date != null ? new SimpleDateFormat(getLocalization().getMessage("format.date")).format((Date)getValue()) : null;
    }

    private Localization getLocalization() {
        if(localization == null) {
            Assert.notNull(ApplicationContextProvider.provide(), "Please register an application context provider in beans configuration");

            localization = new Localization(ApplicationContextProvider.provide());
        }

        return localization;
    }

}
