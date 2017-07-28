package applica.framework.library.utils;

import org.springframework.beans.PropertyValue;
import org.springframework.beans.PropertyValues;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

/**
 * Created by bimbobruno on 03/02/2017.
 */
public class QueryString {

    public static String build(PropertyValues values, boolean encodeUrl) {
        StringBuilder query = new StringBuilder();
        for (PropertyValue v : values.getPropertyValues()) {
            try {
                if (query.length() > 0) {
                    query.append("&");
                }

                query
                        .append(v.getName())
                        .append("=")
                        .append(encodeUrl ? URLEncoder.encode(v.getValue().toString(), "UTF-8") : v.getValue());
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        }

        return query.toString();
    }

    public static String build(PropertyValues values) {
        return build(values, true);
    }

}
