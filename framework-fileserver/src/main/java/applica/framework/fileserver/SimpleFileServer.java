package applica.framework.fileserver;

import applica.framework.library.options.OptionsManager;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.MultipartEntity;
import org.apache.http.entity.mime.content.InputStreamBody;
import org.apache.http.impl.client.DefaultHttpClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.util.UUID;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 4/23/13
 * Time: 12:20 PM
 */
public class SimpleFileServer implements FileServer {

    private Log logger = LogFactory.getLog(getClass());

    @Autowired
    private OptionsManager options;

    private String baseUrl;

    @PostConstruct
    protected void init() {
        baseUrl = options.get("fileserver.base.internal");
    }

    @Override
    public String saveFile(String path, String extension, InputStream fileStream) throws IOException {
        Assert.hasLength(path, "Please provide a valid path");

        String generatedName = String.format("%s.%s", UUID.randomUUID().toString().replace("-", "_"), extension);
        NormalizedUrl normalizedUrl = normalizeUrl(path);
        String fullPath = normalizedUrl.url.concat(generatedName);

        logger.info(String.format("Saving file on path %s", fullPath));

        saveToServer(fileStream, generatedName, baseUrl.concat(fullPath));

        return fullPath;
    }

    private void saveToServer(InputStream fileStream, String filename, String fullPath) throws IOException {
        DefaultHttpClient httpClient = new DefaultHttpClient();
        HttpPost method = new HttpPost(fullPath);
        MultipartEntity entityRequest = new MultipartEntity();
        InputStreamBody streamBody = new InputStreamBody(fileStream, "");
        entityRequest.addPart("file", streamBody);
        method.setEntity(entityRequest);

        HttpResponse response = null;
        try {
            response = httpClient.execute(method);
        } catch (IOException e) {
            throw new IOException(e);
        }
        int code = response.getStatusLine().getStatusCode();

        logger.info(String.format("Save file service returned %d", code));

        throwExceptionByCode(code);

        httpClient.getConnectionManager().shutdown();
    }

    @Override
    public InputStream getFile(String path) throws IOException {
        Assert.hasLength(path, "Please provide a valid path");
        NormalizedUrl normalizedUrl = normalizeUrl(path);

        DefaultHttpClient httpClient = new DefaultHttpClient();
        HttpGet method = new HttpGet(baseUrl.concat(normalizedUrl.url));
        HttpResponse response = null;
        try {
            response = httpClient.execute(method);
            return response.getEntity().getContent();
        } catch (IOException e) {
            throw new IOException(e);
        }
    }

    @Override
    public InputStream getImage(String path, String size) throws IOException {
        Assert.hasLength(path, "Please provide a valid path");
        NormalizedUrl normalizedUrl = normalizeUrl(path);

        DefaultHttpClient httpClient = new DefaultHttpClient();
        String fullUrlWithParams = baseUrl.concat(normalizedUrl.url);
        if (StringUtils.hasLength(size)) {
            fullUrlWithParams = fullUrlWithParams.concat("?size=").concat(size);
        }
        HttpGet method = new HttpGet(fullUrlWithParams);
        HttpResponse response = null;
        try {
            response = httpClient.execute(method);
            return response.getEntity().getContent();
        } catch (IOException e) {
            throw new IOException(e);
        }
    }

    @Override
    public void deleteFile(String path) throws IOException {
        Assert.hasLength(path, "Please provide a valid path");
        NormalizedUrl normalizedUrl = normalizeUrl(path);

        DefaultHttpClient httpClient = new DefaultHttpClient();
        HttpDelete method = new HttpDelete(baseUrl.concat(normalizedUrl.url));
        HttpResponse response = null;
        try {
            response = httpClient.execute(method);
        } catch (IOException e) {
            throw new IOException(e);
        }

        int code = response.getStatusLine().getStatusCode();

        throwExceptionByCode(code);

        httpClient.getConnectionManager().shutdown();
    }

    @Override
    public String saveImage(String path, String extension, InputStream imageStream) throws IOException {
       return saveFile(path, extension,imageStream);
    }

    private void throwExceptionByCode(int code) throws IOException {
        if (code == 404) {
            throw new IOException("not found");
        } else if (code == 500) {
            throw new IOException();
        }
    }

    private NormalizedUrl normalizeUrl(String url) {
        NormalizedUrl normalizedUrl = new NormalizedUrl();
        normalizedUrl.filename = FilenameUtils.getName(url);
        try {
            normalizedUrl.url = String.format("%s%s", FilenameUtils.getFullPath(url), URLEncoder.encode(normalizedUrl.filename, "UTF-8"));
        } catch(Exception ex) {
            normalizedUrl.url = url;
        }

        return normalizedUrl;
    }

    private class NormalizedUrl {
        private String url;
        private String filename;
    }
}
