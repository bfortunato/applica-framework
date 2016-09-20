package applica.framework.library.rest.client;

public interface BaseRequestListener {
	void onError(Exception ex);
	void onComplete(Object response);
}
