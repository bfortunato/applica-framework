package applica.framework.library.rest.client;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntity;
import org.apache.http.entity.mime.content.InputStreamBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public class RestRequest {
	private ResponseType responseType = ResponseType.STRING;
	private String uri;
	private List<BasicNameValuePair> parameters = new ArrayList<BasicNameValuePair>();
	private List<PostedFile> files = new ArrayList<PostedFile>();
	private boolean isAsync = true;
	private PreExecutionListener preExecutionListener;

	public RestRequest(String uri) {
		this.uri = uri;
	}
	
	public RestRequest setPreExecutionListener(PreExecutionListener listener) {
		preExecutionListener = listener;
		return this;
	}
	
	public RestRequest setResponseType(ResponseType responseType) {
		this.responseType = responseType;
		return this;
	}
	
	public RestRequest setAsync(boolean isAsync) {
		this.isAsync = isAsync;
		return this;
	}
	
	public RestRequest addParameter(String name, String value) {
		parameters.add(new BasicNameValuePair(name, value));
		return this;
	}
	
	public RestRequest addFile(String paramName, InputStream stream, String fileName) {
		files.add(new PostedFile(paramName, stream, fileName));
		return this;
	}
	
	public void post(final BaseRequestListener requestListener) {
		
		Runnable runnable = new Runnable() {
			public void run() {
				try {
					if(preExecutionListener != null) preExecutionListener.onPreExecute();
					
					URI uri = new URI(RestRequest.this.uri);
					HttpClient client = new DefaultHttpClient();
					HttpPost post = new HttpPost(uri);
					post.setEntity(new UrlEncodedFormEntity(parameters));
					HttpResponse response = client.execute(post);
					InputStream stream = response.getEntity().getContent();
					Object returnObject = getTypedResponse(stream);
					client.getConnectionManager().shutdown();
					requestListener.onComplete(returnObject);
					stream.close();
				} catch (Exception e) {
					e.printStackTrace();
					requestListener.onError(e);
				}
			}
		};
		if(isAsync) { new Thread(runnable).start(); }
		else { runnable.run(); }
	}
	
	public void download(final DownloadListener requestListener) {
		Runnable runnable = new Runnable() {
			public void run() {
				try {
					if(preExecutionListener != null) preExecutionListener.onPreExecute();
					setResponseType(ResponseType.BINARY);
					
					String uri = RestRequest.this.uri.replaceAll(" ", "%20");
					URL url = new URL(uri);
					
					HttpURLConnection connection = (HttpURLConnection)url.openConnection();
					connection.setRequestMethod("GET");
					connection.connect();					
					int contentSize = connection.getContentLength();					
					InputStream inputStream = connection.getInputStream();
					ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
					int len = 0;
					int lenTotal = 0;
					byte[] buffer = new byte[1024 * 100];
					while((len = inputStream.read(buffer)) > 0)  {
						outputStream.write(buffer, 0, len);
						lenTotal += len;
						
						requestListener.onProgress(lenTotal, contentSize);
					}
					
					inputStream.close();
					buffer = outputStream.toByteArray();					
					outputStream.close();
					
					requestListener.onComplete(buffer);
				} catch (Exception e) {
					e.printStackTrace();
					requestListener.onError(e);
				}
			}
		};
		
		if(isAsync) { new Thread(runnable).start(); }
		else { runnable.run(); }
	}
	
	public void get(final BaseRequestListener requestListener) {
		Runnable runnable = new Runnable() {
			public void run() {
				try {
					if(preExecutionListener != null) preExecutionListener.onPreExecute();

                    URIBuilder builder = new URIBuilder(RestRequest.this.uri);
					for(BasicNameValuePair pair : RestRequest.this.parameters) {
                        builder.addParameter(pair.getName(), pair.getValue());
					}

					URI uri = builder.build();
					HttpClient client = new DefaultHttpClient();
					HttpGet get = new HttpGet(uri);
					HttpResponse response = client.execute(get);
					InputStream stream = response.getEntity().getContent();
					Object returnObject = getTypedResponse(stream);
					client.getConnectionManager().shutdown();
					requestListener.onComplete(returnObject);
					stream.close();
				} catch (Exception e) {
					e.printStackTrace();
					requestListener.onError(e);
				}
			}
		};
		
		if(isAsync) { new Thread(runnable).start(); }
		else { runnable.run(); }
	}
	
	public void upload(final BaseRequestListener requestListener) {
		Runnable runnable = new Runnable() {
			public void run() {
				try {
					if(preExecutionListener != null) preExecutionListener.onPreExecute();
					
					URI uri = new URI(RestRequest.this.uri);
					HttpClient client = new DefaultHttpClient();
					HttpPost post = new HttpPost(uri);
					MultipartEntity entity = new MultipartEntity(HttpMultipartMode.BROWSER_COMPATIBLE);
					for(BasicNameValuePair pair : parameters) {
						StringBody body = new StringBody(pair.getValue());
						entity.addPart(pair.getName(), body);
					}
					for(PostedFile file : files) {
						InputStreamBody body = new InputStreamBody(file.stream, file.fileName);
						entity.addPart(file.paramName, body);
					}			
					post.setEntity(entity);
					HttpResponse response = client.execute(post);
					InputStream stream = response.getEntity().getContent();
					Object returnObject = getTypedResponse(stream);
					client.getConnectionManager().shutdown();
					requestListener.onComplete(returnObject);
					stream.close();
				} catch (Exception e) {
					e.printStackTrace();
					requestListener.onError(e);
				}
			}
		};

		if(isAsync) { new Thread(runnable).start(); }
		else { runnable.run(); }
	}
	
	private String convertStreamToString(InputStream is) {
		 
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
        StringBuilder sb = new StringBuilder();
 
        String line = null;
        try {
            while ((line = reader.readLine()) != null) {
                sb.append(line + "\n");
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                is.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return sb.toString();
    }
    
	private Object getTypedResponse(InputStream stream) throws IOException {
		String content = null;
        ObjectMapper mapper = new ObjectMapper();

		switch (responseType) {
		case STRING:
			content = convertStreamToString(stream);
			return content;
		case JSONARRAY:
			content = convertStreamToString(stream);
			return mapper.readValue(content, ArrayNode.class);
		case JSONOBJECT:
			content = convertStreamToString(stream);
            return mapper.readValue(content, ObjectNode.class);
		case BINARY:
			ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
			byte[] buffer = new byte[1024];
			int bytesRead = 0;
			while((bytesRead = stream.read(buffer)) > 0) {
				outputStream.write(buffer, 0, bytesRead);
			} 
			buffer = outputStream.toByteArray();
			outputStream.close();
			return buffer;
		}
		
		return null;
	}
	
    class PostedFile {
	
		public PostedFile(String paramName, InputStream stream, String fileName) {
			this.paramName = paramName;
			this.stream = stream;
			this.fileName = fileName;
		}
		
		public String paramName;
		public InputStream stream;
		public String fileName;
	}
    
    public interface PreExecutionListener {
    	void onPreExecute() throws Exception;
    }
}