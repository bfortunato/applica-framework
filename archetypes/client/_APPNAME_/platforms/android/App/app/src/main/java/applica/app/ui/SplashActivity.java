package applica.app.ui;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.support.v7.app.AppCompatActivity;

import applica.aj.AJ;
import applica.aj.AJApp;
import applica.aj.AJObject;
import applica.aj.Store;
import applica.app.R;
import applica.app.Actions;
import applica.app.Stores;
import applica.app.plugins.ActivityDependentPlugin;
import applica.app.plugins.AlertPlugin;
import applica.app.plugins.LoaderPlugin;
import applica.app.plugins.PluginContainerActivity;
import applica.app.plugins.ToastPlugin;
import applica.app.ui.home.HomeActivity;
import applica.framework.android.utils.Nulls;

public class SplashActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        //FideniaUtils.setScreenOrientation(this);
        new Thread(new Runnable() {
            @Override
            public void run() {
                AJApp.initApplication(getApplicationContext());

                AJ.registerPlugin(new LoaderPlugin());
                AJ.registerPlugin(new AlertPlugin());
                AJ.registerPlugin(new ToastPlugin());

                //Elenco TUTTI i plugin in modo da poterli utilizzare in seguito
                AJ.subscribe(Stores.SESSION, SplashActivity.this, new Store.Subscription() {
                    @Override
                    public void handle(final AJObject state) {
                        new Handler(getMainLooper()).postDelayed(new Runnable() {
                            @Override
                            public void run() {
                                final boolean loggedIn = Nulls.orElse(state.get("loggedIn").asBoolean(), false);
                                Map<String, Object> params = new HashMap<>();
                                boolean fromNotification = getIntent().getBooleanExtra("fromNotification", false);
                                params.put("fromNotification", fromNotification);
                                if (fromNotification) {
                                    params.put("notificationData", getIntent().getStringExtra("notificationData"));
                                }

                                CustomUtils.goToActivityWithExtras(getApplicationContext(), params, (loggedIn? MainActivity.class : LoginActivity.class));
                                finish();
                            }
                        }, 1000);
                    }
                });

                AJ.run(Actions.RESUME_SESSION);
            }
        }).start();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        AJ.unsubscribe(Stores.SESSION, SplashActivity.this);
    }

}
