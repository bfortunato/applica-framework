package applica.app.plugins;

import android.content.DialogInterface;
import android.support.v7.app.AlertDialog;

import applica.aj.AJObject;

/**
 * Created by bimbobruno on 10/01/2017.
 */

public class AlertPlugin extends ActivityDependentPlugin {

    public static final String NAME = "Alert";

    private AlertDialog current;

    public AlertPlugin() {
        super(NAME);
    }

    public AJObject alert(final AJObject data, Callback callback) {
        if (current != null) {
            return AJObject.empty();
        }

        getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
                String title = data.get("title").asString();
                String message = data.get("message").asString();
                //String type = data.get("type").asString();
                current = builder
                        .setCancelable(true)
                        .setTitle(title)
                        .setMessage(message)
                        .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                current = null;
                            }
                        })
                        .setOnCancelListener(new DialogInterface.OnCancelListener() {
                            @Override
                            public void onCancel(DialogInterface dialogInterface) {
                                current = null;
                            }
                        })
                        .create();

                current.show();
            }
        });

        return AJObject.empty();
    }

    public AJObject confirm(final AJObject data, final Callback callback) {
        if (current != null) {
            return AJObject.empty();
        }

        getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
                String title = data.get("title").asString();
                String message = data.get("message").asString();
                //String type = data.get("type").asString();
                current = builder
                        .setCancelable(true)
                        .setTitle(title)
                        .setMessage(message)
                        .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                current = null;
                                callback.onSuccess(AJObject.empty());
                            }
                        })
                        .setOnCancelListener(new DialogInterface.OnCancelListener() {
                            @Override
                            public void onCancel(DialogInterface dialogInterface) {
                                current = null;
                                callback.onError(AJObject.empty());
                            }
                        })
                        .create();

                current.show();
            }
        });

        return AJObject.empty();
    }

    public AJObject hide(final AJObject data) {
        getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                current.dismiss();
            }
        });
        return AJObject.empty();
    }

}
