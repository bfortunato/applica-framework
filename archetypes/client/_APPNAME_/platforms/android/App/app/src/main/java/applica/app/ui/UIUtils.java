package applica.app.ui;

import applica.aj.AJ;
import applica.app.plugins.ActivityDependentPlugin;
import applica.app.plugins.AlertPlugin;
import applica.app.plugins.LoaderPlugin;
import applica.app.plugins.PluginContainerActivity;
import applica.app.plugins.ToastPlugin;


/**
 * Created by bimbobruno on 10/01/2017.
 */

public class UIUtils {

    public static void registerCommonPlugins(PluginContainerActivity activity) {
        activity.addPlugin(((ActivityDependentPlugin) AJ.getPlugin(LoaderPlugin.NAME)));
        activity.addPlugin(((ActivityDependentPlugin) AJ.getPlugin(ToastPlugin.NAME)));
        activity.addPlugin(((ActivityDependentPlugin) AJ.getPlugin(AlertPlugin.NAME)));
    }

}
