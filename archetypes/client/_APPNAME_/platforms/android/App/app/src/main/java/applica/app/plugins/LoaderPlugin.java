package applica.app.plugins;

import applica.aj.AJObject;
import applica.app.R;
import applica.framework.android.ui.Loader;
import applica.framework.android.utils.Nulls;

/**
 * Created by bimbobruno on 10/01/2017.
 */

public class LoaderPlugin extends ActivityDependentPlugin {

    public static final String NAME = "Loader";

    public LoaderPlugin() {
        super(NAME);
    }

    public void show(final AJObject data, Callback callback) {
        getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                getLoader(true).show("", Nulls.orElse(data.get("title").asString(), getActivity().getString(R.string.loading)));
            }
        });
    }

    public void hide(final AJObject data, Callback callback) {
        getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                getLoader(false).hide();
            }
        });
    }

    private Loader getLoader(boolean create) {
        Loader loader = null;
        if (!create) { loader = (Loader) get("loader"); }
        if (loader == null) {
            loader = new Loader(getActivity());
            put("loader", loader);
        }

        return loader;
    }

}
