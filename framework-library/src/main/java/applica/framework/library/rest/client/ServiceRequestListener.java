package applica.framework.library.rest.client;

public interface ServiceRequestListener<T>  {
	void onError(Exception ex);
	void onComplete(T response);
}
