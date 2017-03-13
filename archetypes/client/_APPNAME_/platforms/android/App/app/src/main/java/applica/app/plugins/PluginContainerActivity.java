package applica.app.plugins;

import android.os.Bundle;
import android.os.PersistableBundle;
import android.support.v7.app.AppCompatActivity;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by bimbobruno on 10/01/2017.
 */

public class PluginContainerActivity extends AppCompatActivity {

    private List<ActivityDependentPlugin> plugins = new ArrayList<>();

    public void addPlugin(ActivityDependentPlugin plugin) {
        plugins.add(plugin);
    }

    @Override
    public void onCreate(Bundle savedInstanceState, PersistableBundle persistentState) {
        super.onCreate(savedInstanceState, persistentState);

        setupPlugins();
    }

    @Override
    protected void onResume() {
        super.onResume();

        setupPlugins();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        for (ActivityDependentPlugin plugin : plugins) {
            plugin.dispose(this);
        }
    }

    protected void setupPlugins() {
        for (ActivityDependentPlugin plugin : plugins) {
            plugin.setActivity(this);
        }
    }
}
