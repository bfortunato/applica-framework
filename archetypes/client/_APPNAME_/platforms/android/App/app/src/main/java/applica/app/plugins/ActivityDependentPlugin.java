package applica.app.plugins;

import android.app.Activity;

import java.util.HashMap;

import applica.aj.runtime.Plugin;

/**
 * Created by bimbobruno on 10/01/2017.
 */

public class ActivityDependentPlugin extends Plugin {

    private Activity activity;
    private HashMap<Activity, HashMap<String, Object>> data = new HashMap<>();

    public ActivityDependentPlugin(String name) {
        super(name);
    }

    public Activity getActivity() {
        if (activity == null) {
            throw new RuntimeException("Trying to get activity from plugin " + getClass().getName() + ". Have you registered plugin to container activity?");
        }

        return activity;
    }

    public void setActivity(Activity activity) {
        this.activity = activity;
    }

    public void put(String key, Object value) {
        checkActivity();

        if (!data.containsKey(activity)) {
            data.put(activity, new HashMap<String, Object>());
        }

        data.get(activity).put(key, value);
    }

    public Object get(String key) {
        checkActivity();

        if (!data.containsKey(activity)) {
            return null;
        }

        if (data.get(activity).containsKey(key)) {
            return data.get(activity).get(key);
        }

        return null;
    }

    public void dispose(Activity activity) {
        data.remove(activity);
    }

    private void checkActivity() {
        if (activity == null) {
            throw new RuntimeException("Trying to get activity data but activity is not set");
        }
    }
}
