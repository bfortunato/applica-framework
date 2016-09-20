package applica.framework.library.rest.client;

public interface DownloadListener extends BaseRequestListener {
	void onProgress(float progress, float total) throws OperationCanceledException;
}
