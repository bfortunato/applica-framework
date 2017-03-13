package applica.app.ui;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import applica.app.R;
import applica.app.ui.login.LoginActivity;
import applica.framework.android.ui.injector.Click;
import applica.framework.android.ui.injector.Injector;

public class WelcomeActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_welcome);

        Injector.resolve(this);
    }

    @Click(R.id.login_button)
    public void login() {
        startActivity(new Intent(this, LoginActivity.class));
    }
}
