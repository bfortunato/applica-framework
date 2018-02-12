package applica.app.utils;

import android.app.Activity;
import android.app.ActivityManager;
import android.app.ProgressDialog;
import android.content.ComponentName;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.media.ThumbnailUtils;
import android.net.Uri;
import android.os.AsyncTask;
import android.provider.MediaStore;
import android.provider.OpenableColumns;
import android.support.v7.app.AlertDialog;
import android.util.DisplayMetrics;
import android.view.Display;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.view.inputmethod.InputMethodManager;
import android.widget.ImageView;
import android.widget.TextView;

import com.loopj.android.http.AsyncHttpClient;

import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.io.InputStream;
import java.io.Serializable;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import applica.framework.android.ui.URLImageViewsManager;
import applica.framework.android.utils.Listener;
import applica.framework.android.utils.MediaRenderer;
import me.leolin.shortcutbadger.ShortcutBadger;

/**
 * Created by antoniolovicario on 29/04/17.
 */

public class AndroidUtils {
    private static ProgressDialog progressDialog;
    private static AsyncHttpClient client;

    public static void goToWebPage(Activity activity, String url) {
        Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
        activity.startActivity(browserIntent);
    }


    public static void hideKeyboard(Context context, View view) {
        InputMethodManager imm = (InputMethodManager) context.getSystemService(Context.INPUT_METHOD_SERVICE);
        imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
    }

    public static void showSoftKeyboard(Context context, View view) {
        InputMethodManager imm = (InputMethodManager) context.getSystemService(Context.INPUT_METHOD_SERVICE);
        imm.showSoftInputFromInputMethod(view.getWindowToken(), 0);
    }

    public static void showOnButtonDialog(Context context, String title, String message, boolean negativeButton,DialogInterface.OnClickListener listener) {
        AlertDialog.Builder d = new AlertDialog.Builder(context)
                .setTitle(title)
                .setMessage(message)
                .setIcon(android.R.drawable.ic_dialog_alert)
                .setPositiveButton("Ok", listener);
        if (negativeButton) {
            d.setNegativeButton("Annulla", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                    dialog.dismiss();
                }
            });
        }
        d.show();
    }

    private static void createImageConfiguration(URLImageViewsManager imagesManager, Object result, URL url, Bitmap defaultBitmap) {
        imagesManager
                .configure(result)
                .url(url)
                .effect(URLImageViewsManager.ImageDisplayEffect.SCALE)
                .defaultBitmap(defaultBitmap)
                .ok();
    }

    public static BitmapDrawable getDrawableFromBitmap(Context context, Bitmap bitmap) {
        return new BitmapDrawable(context.getResources(), bitmap);
    }

    public static Bitmap getBitmapFromDrawable(Context mContext, int drawableId) {
        return BitmapFactory.decodeResource(mContext.getResources(), drawableId);
    }

    public static void setHeightToView(View v, int newheight) {
        ViewGroup.LayoutParams params;

        params = v.getLayoutParams();
        if (params != null) {
            params.height = newheight;

        } else {
            params = new ViewGroup.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, newheight);
        }
        v.setLayoutParams(params);

    }

    public static long getFileSize(Context context, Uri uri) {
        Cursor returnCursor = context.getContentResolver().query(uri, null, null, null, null);
        int sizeIndex = returnCursor.getColumnIndex(OpenableColumns.SIZE);
        returnCursor.moveToFirst();
        return returnCursor.getLong(sizeIndex);
    }

    public static String getPath(Context context, Uri uri) {
        String[] projection = { MediaStore.Files.FileColumns.DATA };
        Cursor cursor = context.getContentResolver().query(uri, projection, null, null, null);

        try {
            if(cursor == null){
                return uri.getPath();
            }
            else{
                String path = null;
                cursor.moveToFirst();
                int column_index = cursor.getColumnIndexOrThrow(projection[0]);
                path = cursor.getString(column_index);
                cursor.close();
                if (org.springframework.util.StringUtils.hasLength(path))
                    return path;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }



        Cursor returnCursor = context.getContentResolver().query(uri, null, null, null, null);
        int nameIndex = returnCursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
        returnCursor.moveToFirst();
        return returnCursor.getString(nameIndex);

    }

    /**
     * Callback
     *
     * @param <T>
     */
    public interface Callback<T> {
        /**
         * The only good situation.
         *
         * @param response typized response returned by successed operation.
         */
        void onSuccess(T response);

        /**
         * We can handle two kind of error: logical and critical.
         * Critical is generated by the app when something is written by a PDM.
         * Logical is when we have to manage impossible situations with custom logic.
         * The second case should (must) be never used inside the rest client but I still want to publish it here.
         *
         * @param message   logical error message that has generated the failing operation.
         * @param throwable an exception, useful to check stack trace or send it to firebase?
         */
        void onError(String message, Exception throwable);

        /**
         * Allows you to create end event handler.
         * This event is fired after success or error, useful to deal with shared logic between
         * two different app behavior.
         */
        void onFinish();
    }

    /**
     * This callback can be used with progressive menu_download actions (like files).
     *
     * @param <T> a base response to be used.
     */
    public interface CallbackWithProgress<T> extends Callback<T> {
        /**
         * You can provide current percentage and max value allowed for the item.
         *
         * @param percentage current progress percentage.
         * @param max        max reachable percentage.
         */
        void onProgress(float percentage, float max);
    }

    public static void goToActivityWithExtras(Context context, Map<String, Object> extras, Class mainActivityClass) {
        Intent intent = new Intent(context, mainActivityClass);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        popolateIntentExtras(intent, extras);
        context.startActivity(intent);
    }

    private static void popolateIntentExtras(Intent intent, Map<String, Object> extras) {
        if (extras != null && !extras.isEmpty()) {
            for (String key : extras.keySet()) {
                if (extras.get(key) instanceof String) {
                    intent.putExtra(key, (String) extras.get(key));
                } else {
                    intent.putExtra(key, (Serializable) extras.get(key));
                }

            }
        }
    }

    public static void loadRemoteImage(final String imageUrl, final Listener<Drawable> listener) {

        new AsyncTask<Void, Void, Drawable>() {
            @Override
            protected Drawable doInBackground(Void... params) {
                URL thumb_u = null;
                try {
                    thumb_u = new URL(imageUrl);
                    return Drawable.createFromStream(thumb_u.openStream(), "src");
                } catch (Exception e) {
                    e.printStackTrace();
                    return null;
                }

            }

            ;

            @Override
            protected void onPostExecute(Drawable drawable) {
                if (drawable != null)
                    listener.onSuccess(drawable);
                else
                    listener.onError("Errore durante l'operazione!");
            }

        }.execute();
    }


    public static void displayRemoteImageIntoView(final String imageUrl, final ImageView imageView) {

        new AsyncTask<Void, Void, Drawable>() {
            @Override
            protected Drawable doInBackground(Void... params) {
                URL thumb_u = null;
                try {
                    thumb_u = new URL(imageUrl);
                    return Drawable.createFromStream(thumb_u.openStream(), "src");
                } catch (Exception e) {
                    e.printStackTrace();
                    return null;
                }

            }

            ;

            @Override
            protected void onPostExecute(Drawable drawable) {
                imageView.setImageDrawable(drawable);
                if (drawable != null) {
                    imageView.setVisibility(View.VISIBLE);
                }
            }
        }.execute();
    }

    public static void setImageToView(Context context, String imageUrl, final ImageView view, Integer widthDp, Integer heightDp) {
        loadImage(context, imageUrl, false, widthDp, heightDp, new Listener<Bitmap>() {
            @Override
            public void onSuccess(Bitmap response) {
                view.setImageBitmap(response);
            }

            @Override
            public void onError(String error) {

            }
        });
    }

    public static boolean isXLargeScreen(Context context) {
        return (context.getResources().getConfiguration().screenLayout
                & Configuration.SCREENLAYOUT_SIZE_MASK)
                >= Configuration.SCREENLAYOUT_SIZE_XLARGE;
    }

    public static void loadImage(final Context context, final String path, final boolean makeCircle, final Integer widthPx, final Integer heightPx, final Listener<Bitmap> listener) {
        DisplayMetrics metrics = context.getResources().getDisplayMetrics();
        final int density = metrics.densityDpi;
        final WindowManager windowManager = (WindowManager) context
                .getSystemService(Context.WINDOW_SERVICE);
        final Display display = windowManager.getDefaultDisplay();
        new AsyncTask<Void, Void, Bitmap>() {
            @Override
            protected Bitmap doInBackground(Void... params) {
                MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
                Bitmap bitmap = null;
                try {
                    //int px = ;
                    int withToSend = widthPx != null ? widthPx : 0;
                    int heightToSend = heightPx != null ? heightPx : 0;
                    //int heightToSend = heightpx != null ? heightpx : px;

                    String resize = withToSend > 0 && heightToSend > 0 ? String.format("?size=%dx%d", withToSend, heightToSend) : "";
                    InputStream stream = MediaRenderer.getInputStream(path + resize);
                    bitmap = MediaRenderer.decodeStreamToBitmap(stream, display, MediaRenderer.getBytes(stream));
                    if (bitmap != null) {
                        bitmap = MediaRenderer.decodeAccordingToMemory(context, bitmap);
                        if (makeCircle)
                            bitmap = MediaRenderer.getCircularBitmap(bitmap);
                        return bitmap;
                    }
                } catch (Exception e) {
                    listener.onError(e.getMessage());
                }

                return null;
            }

            @Override
            protected void onPostExecute(Bitmap response) {
                if (response != null) {
                    listener.onSuccess(response);
                } else
                    listener.onError("Errore durante il caricamento dell'immagine");
            }

        }.execute();
    }

    public static float convertDpToPixel(float dp, Context context) {
        Resources resources = context.getResources();
        DisplayMetrics metrics = resources.getDisplayMetrics();
        float px = dp * ((float) metrics.densityDpi / DisplayMetrics.DENSITY_DEFAULT);
        return px;
    }

    public static int getStatusBarHeight(Activity activity) {
        int result = 0;
        int resourceId = activity.getResources().getIdentifier("status_bar_height", "dimen", "android");
        if (resourceId > 0) {
            result = activity.getResources().getDimensionPixelSize(resourceId);
        }
        return result;
    }

    public static String getFileExtention(String s) {
        String extention;
        try {
            extention = s.split("\\.")[1].toUpperCase();
        } catch (Exception e) {
            extention = "FILE";
        }
        return extention;
    }


    public static void openRemoteFile(final Context context, final String downloadUrl) {

        Uri uri = Uri.parse(String.format("%s%s", Config.FILESERVER_BASE, downloadUrl));
        Intent intent = new Intent(Intent.ACTION_VIEW, uri);
        context.startActivity(intent);

    }


    public static List<View> getViewsByTag(ViewGroup root, String tag) {
        List<View> views = new ArrayList<View>();
        final int childCount = root.getChildCount();
        for (int i = 0; i < childCount; i++) {
            final View child = root.getChildAt(i);
            if (child instanceof ViewGroup) {
                views.addAll(getViewsByTag((ViewGroup) child, tag));
            }

            final Object tagObj = child.getTag();
            if (tagObj != null && tagObj.equals(tag)) {
                views.add(child);
            }

        }
        return views;
    }

    /**
     * Recursive andrebbe settato a false in caso la vista che si desidera cercare è una viewGroup
     *
     * @param root
     * @param aClass
     * @param recursive
     * @return
     */
    public static List<View> getAllSubviewsOfType(ViewGroup root, Class aClass, boolean recursive) {
        List<View> views = new ArrayList<View>();
        final int childCount = root.getChildCount();
        for (int i = 0; i < childCount; i++) {
            final View child = root.getChildAt(i);
            if (recursive) {
                if (child instanceof ViewGroup) {
                    views.addAll(getAllSubviewsOfType((ViewGroup) child, aClass, recursive));
                }
            }

            if (child.getClass().equals(aClass)) {
                views.add(child);
            }

        }
        return views;
    }


    public static void setMargin(TextView tv, int left, int right) {
        tv.setPadding(left, 0, right, 0);
    }

    public static void setMargins(View v, int l, int t, int r, int b) {
        if (v.getLayoutParams() instanceof ViewGroup.MarginLayoutParams) {
            ViewGroup.MarginLayoutParams p = (ViewGroup.MarginLayoutParams) v.getLayoutParams();
            p.setMargins(l, t, r, b);
            v.requestLayout();
        }
    }


    //    public static void downloadFile(final Context context, final String downloadUrl, final String filename, final CallbackWithProgress<File> handler) {
//
//        try {
//            FileAsyncHttpResponseHandler fileHandler = new FileAsyncHttpResponseHandler(context) {
//                @Override
//                public void onFailure(int statusCode, Header[] headers, Throwable throwable, File file) {
//                    handler.onError(null, new Exception(throwable));
//                    handler.onFinish();
//                }
//
//                @Override
//                public void onSuccess(int statusCode, Header[] headers, File file) {
//                    File destinationFile = new File(context.getCacheDir(), filename);
//                    file.renameTo(destinationFile);
//                    handler.onSuccess(destinationFile);
//                    handler.onFinish();
//                }
//
//                @Override
//                public void onProgress(long bytesWritten, long totalSize) {
//                    super.onProgress(bytesWritten, totalSize);
//                    handler.onProgress(bytesWritten, totalSize);
//                }
//
//                @Override
//                public void onCancel() {
//
//                }
//            };
//            if (client == null) {
//                client = new AsyncHttpClient(true, 80, 443);
//            }
//            client.get(String.format("%s%s", Config.FILESERVER_BASE,downloadUrl), fileHandler);
//        }
//        catch (Exception e) {
//            e.printStackTrace();
//            handler.onError(null, e);
//            handler.onFinish();
//        }
//
//    }
    public static void setWidthToView(View view, int newWidth) {
        ViewGroup.LayoutParams params;

        params = view.getLayoutParams();
        if (params != null) {
            params.width = newWidth;

        } else {
            params = new ViewGroup.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, newWidth);
        }
        view.setLayoutParams(params);
    }

    public static int countStackActivities(Activity activity) {
        ActivityManager am = (ActivityManager)activity.getSystemService(Context.ACTIVITY_SERVICE);

        int sizeStack =  am.getRunningTasks(2).size();

        for(int i = 0;i < sizeStack;i++){

            ComponentName cn = am.getRunningTasks(2).get(i).topActivity;
        }
        return sizeStack;
    }

    public static void setBadge(Context context, int count) {
        if (count > 0)
            ShortcutBadger.applyCount(context, count); //for 1.1.4+
        else
            ShortcutBadger.removeCount(context);
    }



    public static Bitmap getResizedBitmap(Bitmap bitmap, int width, int height) {
        return ThumbnailUtils.extractThumbnail(bitmap, width, height);
    }
}
