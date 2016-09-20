package applica.framework.library.utils;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by bimbobruno on 11/03/15.
 */
public class ParametrizedObject {

    private Map<String, String> params = new HashMap<>();

    public Map<String, String> getParams() {
        return params;
    }

    public void setParams(Map<String, String> params) {
        this.params = params;
    }

    public String getParam(String key) {
        if (params.containsKey(key)) {
            return params.get(key);
        }

        return null;
    }

    public String getParam(String key, String fallback) {
        if (params.containsKey(key)) {
            return params.get(key);
        }

        return fallback;
    }

    public ParametrizedObject putParam(String key, String value) {
        params.put(key, value);
        return this;
    }

}
