package applica.framework.library.i18n;

import org.springframework.context.ApplicationContext;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.util.StringUtils;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class Localization {
    private Locale locale;
    private ApplicationContext context;
    private Object[] tmp = new Object[0];

    public Localization() {
        locale = LocaleContextHolder.getLocale();
    }

    public Localization(ApplicationContext context) {
        this();
        this.context = context;
    }

    public ApplicationContext getContext() {
        return context;
    }

    public void setContext(ApplicationContext context) {
        this.context = context;
    }

    public String getMessage(String key) {
        locale = LocaleContextHolder.getLocale();

        String message = null;

        if (StringUtils.hasLength(key)) {

            if (key.startsWith("raw:")) {
                message = key.substring(4);
            } else {
                try {
                    message = context.getMessage(key, tmp, locale);
                } catch (Exception ex) {
                    message = key;
                }
            }
        }

        return message;
    }

    public String getCode() {
        return locale.toString();
    }

    public String formatDate(Date date) {
        String formatted = null;
        if(date == null) {
            formatted = "";
        } else {
            try {
                DateFormat format = new SimpleDateFormat(getMessage("format.date"));
                formatted = format.format(date);
            } catch (Throwable e) {}
        }

        return formatted;
    }

    public String formatDateTime(Date date) {
        String formatted = null;
        if(date == null) {
            formatted = "";
        } else {
            try {
                DateFormat format = new SimpleDateFormat(getMessage("format.date") + " " + getMessage("format.time"));
                formatted = format.format(date);
            } catch (Throwable e) {}
        }

        return formatted;
    }

    public String formatTime(Date date) {
        String formatted = null;
        if(date == null) {
            formatted = "";
        } else {
            try {
                DateFormat format = new SimpleDateFormat(getMessage("format.time"));
                formatted = format.format(date);
            } catch (Throwable e) {}
        }

        return formatted;
    }

    public String m(String key) {
        return getMessage(key);
    }
}
