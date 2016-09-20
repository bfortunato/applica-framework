package applica.framework.library.i18n.controllers;

import applica.framework.library.cache.Cache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.io.InputStream;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Properties;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 2/26/13
 * Time: 5:14 PM
 */

/**
 * Use this controller to inject translations in javascript
 * Translations are in a msg global variables.
 * All texts in resources files are injected changing the sintax
 * Es: label.user_name -> msg.LABEL_USER_NAME //deprecated
 * Es: msg.password_changed -> msg.MSG_PASSWORD_CHANGED //deprecated
 * Es: _m("msg.password_changed")
 */
@RequestMapping("/framework-dynamic-resources")
public class JsMessagesController {

    @Autowired
    private ResourceBundleMessageSource messageSource;

    @Autowired
    private Cache cache;

    @RequestMapping("/messages.js")
    public @ResponseBody String messages(Locale locale) {
        String messages = (String) cache.get("localization.messages");
        String cachedLocale = (String) cache.get("localization.locale");

        if(messages == null || !cachedLocale.equals(locale.getDisplayName())) {
            Properties properties = new Properties();
            InputStream in = getClass().getResourceAsStream(String.format("/messages/messages_%s.properties", locale));
            if(in == null) {
                in = getClass().getResourceAsStream("/messages/messages.properties");
            };

            Objects.requireNonNull(in, "Please specify a default resource file for localization");

            StringBuffer values = new StringBuffer();

            //this is deprecated but present for retrocompatibility
            values.append("var msg = {};\r\n");
             try {
                properties.load(in);

                for (Map.Entry<Object, Object> message : properties.entrySet()) {
                    values.append(String.format("msg.%s = '%s';\r\n",
                            message.getKey().toString().replace(".", "_").toUpperCase(),
                            message.getValue().toString().replace("'", "\\'")
                    ));
                }
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                try {
                    in.close();
                } catch (IOException e) {}
            }

            in = getClass().getResourceAsStream(String.format("/messages/messages_%s.properties", locale));
            if(in == null) {
                in = getClass().getResourceAsStream("/messages/messages.properties");
            };

            //use this method instead
            values.append("var __LOCALIZATIONS = {};\r\n");
            try {
                properties.load(in);

                for (Map.Entry<Object, Object> message : properties.entrySet()) {
                    values.append(String.format("__LOCALIZATIONS['%s'] = '%s';\r\n",
                            message.getKey(),
                            message.getValue().toString().replace("'", "\\'")
                    ));
                }
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                try {
                    in.close();
                } catch (IOException e) {}
            }

            values.append("function _m(key) { if (__LOCALIZATIONS[key]) { return __LOCALIZATIONS[key]; } else { console.warn(key + ' not localized'); return key; } }\n");

            messages = values.toString();
            cache.put("localization.messages", messages);
            cache.put("localization.locale", locale.getDisplayName());
        }

        return messages;
    }

}
