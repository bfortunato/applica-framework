package applica.aj.ui;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;

import java.util.HashMap;
import java.util.Map;

import applica.aj.AJ;
import applica.aj.AJObject;
import applica.aj.Store;

/**
 * Created by bimbobruno on 14/03/2017.
 */

public abstract class AJActivity extends AppCompatActivity {

    private StoreDefinitions mDefinitions = new StoreDefinitions();
    private OnBackPressListener onBackPressListener;
    private Map<String, AJObject> mLastStates = new HashMap<>();

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        defineStores(mDefinitions);
        initStores();
        onSetupView();
        Injector.resolve(this);
        onViewLoaded();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        deinitStore();
    }

    protected void initStores() {
        for (final String store : mDefinitions.getStores()) {
            AJ.subscribe(store, this, new Store.Subscription() {
                @Override
                public void handle(AJObject state) {
                    AJObject lastState = getLastState(store);
                    onUpdateView(store, state, lastState);
                }
            });
        }
    }

    private AJObject getLastState(String store) {
        if (mLastStates.containsKey(store)) {
            return mLastStates.get(store);
        } else {
            return AJObject.empty();
        }
    }

    protected void deinitStore() {
        for (final String store : mDefinitions.getStores()) {
            AJ.unsubscribe(store, this);
        }
    }

    public void setupToolbar(Toolbar toolbar, String title, int backIcon) {

        toolbar.setTitle(title);
        toolbar.setTitleTextColor(getResources().getColor(android.R.color.white));
        setSupportActionBar(toolbar);
        if (backIcon > 0) {
            //setto l'icona per tornare all'activity precedente
            toolbar.setNavigationIcon(backIcon);
        }
        //setStatusBarTranslucent(true);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();
        //noinspection SimplifiableIfStatement
        if (id == android.R.id.home) {
            onBackPressed();
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onBackPressed() {
        if (onBackPressListener != null)
            onBackPressListener.performAction();
        else
            super.onBackPressed();
    }

    public void setOnBackPressListener(OnBackPressListener onBackPressListener) {
        this.onBackPressListener = onBackPressListener;
    }

    public OnBackPressListener getOnBackPressListener() {
        return onBackPressListener;
    }

    public interface OnBackPressListener {
        void performAction();
    }

    @Override
    protected void onResume() {
        super.onResume();
        AJApp.setActivityVisible(true);

    }

    @Override
    protected void onPause() {
        super.onPause();
        AJApp.setActivityVisible(false);
    }


    protected abstract void defineStores(StoreDefinitions definitions);
    protected abstract void onSetupView();
    protected abstract void onUpdateView(String store, AJObject state, AJObject lastState);

    //Tutte le operazioni nella onViewLoaded possono utilizzare l'Injector di AJ
    protected abstract void onViewLoaded();
}
