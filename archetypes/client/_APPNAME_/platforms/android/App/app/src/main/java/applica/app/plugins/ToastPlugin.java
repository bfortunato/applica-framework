package applica.app.plugins;

import android.widget.Toast;

import applica.aj.AJObject;

/**
 * Created by bimbobruno on 10/01/2017.
 */

public class ToastPlugin extends ActivityDependentPlugin {

    public static final String NAME = "Toast";

    public ToastPlugin() {
        super(NAME);
    }

    public void show(final AJObject data, Callback callback) {
        getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Toast.makeText(getActivity(), data.get("message").asString(), Toast.LENGTH_SHORT).show();
            }
        });
    }

}
