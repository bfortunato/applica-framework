package applica.app.plugins;

import android.os.Bundle;
import android.os.PersistableBundle;
import android.support.v7.app.AppCompatActivity;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by bimbobruno on 10/01/2017.
 */

public abstract class PluginContainerActivity extends AJActivity {

    private List<ActivityDependentPlugin> plugins = new ArrayList<>();



    public void addPlugin(ActivityDependentPlugin plugin) {
        plugins.add(plugin);
    }


    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        UIUtils.registerCommonPlugins(this);

    }

    @Override
    protected void onResume() {
        if (AJApp.current() == null) {
            //prevengo il caso in cui l'app viene ripresa dal background ma l'AJApp non risulta inizializzata, che si verifica su alcuni dispositivi
            applica.app.utils.AndroidUtils.goToActivityWithExtras(getApplicationContext(),null, SplashActivity.class);
            finish();
        } else {
            super.onResume();
            for (ActivityDependentPlugin plugin : plugins) {
                plugin.setActivity(this);
            }
        }

    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        for (ActivityDependentPlugin plugin : plugins) {
            plugin.dispose(this);
        }
    }
}
