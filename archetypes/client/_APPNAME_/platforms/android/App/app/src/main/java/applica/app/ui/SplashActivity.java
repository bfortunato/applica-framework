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

public class SplashActivity extends PluginContainerActivity {

    private AJObject mLastState = AJObject.empty();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        new Thread(new Runnable() {
            @Override
            public void run() {
                AJApp app = new AJApp(getApplicationContext());
                app.setDebug(false);
                app.setSocketUrl("http://192.168.0.8:3000");
                app.init();

                AJ.registerPlugin(new LoaderPlugin());
                AJ.registerPlugin(new AlertPlugin());
                AJ.registerPlugin(new ToastPlugin());

                UIUtils.registerCommonPlugins(SplashActivity.this);
                setupPlugins();

                AJ.subscribe(Stores.SESSION, this, new Store.Subscription() {
                    @Override
                    public void handle(AJObject state) {
                        if (state.differsAt("resumeComplete").from(mLastState)) {
                            if (Nulls.orElse(state.get("resumeComplete").asBoolean(), false)) {
                                if (state.differsAt("isLoggedIn").from(mLastState)) {
                                    if (state.get("isLoggedIn").asBoolean()) {
                                        new Handler(getMainLooper()).postDelayed(new Runnable() {
                                            @Override
                                            public void run() {
                                                Intent intent = new Intent(SplashActivity.this, HomeActivity.class);
                                                startActivity(intent);
                                                finish();
                                            }
                                        }, 1000);
                                    }
                                }
                            } else {
                                new Handler(getMainLooper()).postDelayed(new Runnable() {
                                    @Override
                                    public void run() {
                                        Intent intent = new Intent(SplashActivity.this, WelcomeActivity.class);
                                        startActivity(intent);
                                        finish();
                                    }
                                }, 1000);
                            }
                        }
                    }
                });

                AJ.run(Actions.RESUME_SESSION);
            }
        }).start();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        AJ.unsubscribe(Stores.COMMONS, this);
    }
}
