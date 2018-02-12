package applica.app;

import applica.aj.Async;

/**
 * Created by bimbobruno on 21/04/16.
 */
public class Application extends MultiDexApplication {

    @Override
    public void onCreate() {
        Async.init();
        super.onCreate();

        StrictMode.VmPolicy.Builder builder = new StrictMode.VmPolicy.Builder();
        StrictMode.setVmPolicy(builder.build());
    }
}