package applica.app.ui.login;

import android.content.Intent;
import android.os.Bundle;
import android.os.PersistableBundle;
import android.widget.EditText;

import applica.aj.AJ;
import applica.aj.AJObject;
import applica.aj.Store;
import applica.app.Actions;
import applica.app.R;
import applica.app.Stores;
import applica.app.plugins.PluginContainerActivity;
import applica.app.ui.UIUtils;
import applica.app.ui.home.HomeActivity;
import applica.framework.android.ui.injector.Click;
import applica.framework.android.ui.injector.InjectView;
import applica.framework.android.ui.injector.Injector;
import applica.framework.android.utils.Nulls;

public class LoginActivity extends PluginContainerActivity {

    private AJObject mLastState;

    @InjectView(R.id.username)
    private EditText mUsernameEditText;

    @InjectView(R.id.password)
    private EditText mPasswordEditText;


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        UIUtils.registerCommonPlugins(this);

        Injector.resolve(this);

        AJ.subscribe(Stores.SESSION, this, new Store.Subscription() {
            @Override
            public void handle(AJObject state) {
                if (state.differsAt("isLoggedIn").from(mLastState)) {
                    if (Nulls.orElse(state.get("isLoggedIn").asBoolean(), false)) {
                        startActivity(new Intent(LoginActivity.this, HomeActivity.class));
                    }
                }

                mLastState = state;
            }
        });
    }

    @Override
    public void onDestroy() {
        super.onDestroy();

        AJ.unsubscribe(Stores.SESSION, this);
    }

    @Click(R.id.login_button)
    public void login() {
        AJ.run(Actions.LOGIN, AJObject.create()
                .set("mail", mUsernameEditText.getText().toString())
                .set("password", mPasswordEditText.getText().toString()));
    }

}
