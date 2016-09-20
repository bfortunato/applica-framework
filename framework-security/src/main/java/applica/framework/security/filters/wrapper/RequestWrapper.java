package applica.framework.security.filters.wrapper;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by bimbobruno on 18/05/16.
 */
public final class RequestWrapper extends HttpServletRequestWrapper {
    private Log logger = LogFactory.getLog(getClass());
    public RequestWrapper(HttpServletRequest servletRequest) {
        super(servletRequest);
    }

    public String[] getParameterValues(String parameter) {
        logger.info("InarameterValues .. parameter .......");
        String[] values = super.getParameterValues(parameter);
        if (values == null) {
            return null;
        }
        int count = values.length;
        String[] encodedValues = new String[count];
        for (int i = 0; i < count; i++) {
            encodedValues[i] = cleanXSS(values[i]);
        }
        return encodedValues;
    }

    @Override
    public Map<String, String[]> getParameterMap() {
        Map<String, String[]> map = new HashMap<>();
        Map<String, String[]> mapRquest = super.getParameterMap();
        mapRquest.keySet().forEach(s -> {
          map.put(s,cleanXSS(mapRquest.get(s)));
        });
        return map;
    }

    public String getParameter(String parameter) {
        logger.info("Inarameter .. parameter .......");
        String value = super.getParameter(parameter);
        if (value == null) {
            return null;
        }
        logger.info("Inarameter RequestWrapper ........ value .......");
        return cleanXSS(value);
    }

    public String getHeader(String name) {
        logger.info("Ineader .. parameter .......");
        String value = super.getHeader(name);
        if (value == null)
            return null;
        logger.info("Ineader RequestWrapper ........... value ....");
        return cleanXSS(value);
    }

    private String cleanXSS(String value) {
        // You'll need to remove the spaces from the html entities below
        logger.info("InnXSS RequestWrapper ..............." + value);
      value = Jsoup.clean(value, Whitelist.simpleText());
        logger.info("OutnXSS RequestWrapper ........ value ......." + value);
        return value;
    }

    private String[] cleanXSS(String[] values){
        if (values == null) {
            return null;
        }
        int count = values.length;
        String[] encodedValues = new String[count];
        for (int i = 0; i < count; i++) {
            encodedValues[i] = cleanXSS(values[i]);
        }
        return encodedValues;
    }
}