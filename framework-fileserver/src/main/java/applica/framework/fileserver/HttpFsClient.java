package applica.framework.fileserver;

import applica.framework.library.options.OptionsManager;
import org.apache.commons.io.IOUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.InputStreamBody;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 4/23/13
 * Time: 12:20 PM
 */
public class HttpFsClient implements FsClient, InitializingBean {

    private Log logger = LogFactory.getLog(getClass());

    private final OptionsManager options;

    private String baseUrl;

    public HttpFsClient(OptionsManager options) {
        this.options = options;
    }

    public void afterPropertiesSet() {
        baseUrl = options.get("fileserver.base.internal");
    }

    @Override
    public void saveFile(String path, InputStream fileStream, boolean overwrite) throws IOException {
        Assert.hasLength(path, "Please provide a valid path");

        logger.info(String.format("Saving file on path %s", path));

        saveToServer(fileStream, path);
    }

    private void saveToServer(InputStream fileStream, String path) throws IOException {
        CloseableHttpClient client = HttpClients.createDefault();
        HttpPost method = new HttpPost(base(path));
        HttpEntity entity = MultipartEntityBuilder.create()
                .addPart("file", new InputStreamBody(fileStream, ""))
                .build();

        method.setEntity(entity);

        CloseableHttpResponse response = null;
        try {
            response = client.execute(method);
        } catch (IOException e) {
            throw new IOException(e);
        } finally {
            if (response != null) {
                response.close();
            }

            client.close();
        }
        int code = response.getStatusLine().getStatusCode();

        logger.info(String.format("Save file service returned %d", code));

        throwExceptionByCode(code);

        client.close();
    }

    private String base(String path) {
        if (baseUrl.endsWith("/") && path.startsWith("//")) {
            path = path.substring(1);
        }
        return baseUrl.concat(path);
    }

    @Override
    public InputStream getFile(String path) throws IOException {
        Assert.hasLength(path, "Please provide a valid path");

        CloseableHttpClient client = HttpClients.createDefault();
        HttpGet method = new HttpGet(base(path));
        CloseableHttpResponse response = null;
        try {
            response = client.execute(method);
            InputStream inputStream = response.getEntity().getContent();
            byte[] buffer = IOUtils.toByteArray(inputStream);
            return new ByteArrayInputStream(buffer);
        } catch (IOException e) {
            throw new IOException(e);
        } finally {
            if (response != null) {
                response.close();
            }
            client.close();
        }
    }

    @Override
    public InputStream getImage(String path, String size) throws IOException {
        Assert.hasLength(path, "Please provide a valid path");

        CloseableHttpClient client = HttpClients.createDefault();
        String fullUrlWithParams = base(path);
        if (StringUtils.hasLength(size)) {
            fullUrlWithParams = fullUrlWithParams.concat("?size=").concat(size);
        }
        HttpGet method = new HttpGet(fullUrlWithParams);
        CloseableHttpResponse response = null;
        try {
            response = client.execute(method);
            InputStream inputStream = response.getEntity().getContent();
            byte[] buffer = IOUtils.toByteArray(inputStream);
            return new ByteArrayInputStream(buffer);
        } catch (IOException e) {
            throw new IOException(e);
        } finally {
            if (response != null) {
                response.close();
            }

            client.close();
        }
    }

    @Override
    public void deleteFile(String path) throws IOException {
        Assert.hasLength(path, "Please provide a valid path");

        CloseableHttpClient client = HttpClients.createDefault();
        HttpDelete method = new HttpDelete(base(path));
        CloseableHttpResponse response = null;
        try {
            response = client.execute(method);
        } catch (IOException e) {
            throw new IOException(e);
        } finally {
            if (response != null) {
                response.close();
            }
        }

        int code = response.getStatusLine().getStatusCode();

        throwExceptionByCode(code);

        client.close();
    }

    @Override
    public void saveImage(String path, InputStream imageStream, boolean overwrite) throws IOException {
        saveFile(path, imageStream, overwrite);
    }

    private void throwExceptionByCode(int code) throws IOException {
        if (code != 200) {
            if (code == 404) {
                throw new IOException("not found");
            } else {
                throw new IOException("Error " + code);
            }
        }
    }

    @Override
    public boolean exists(String path) {
        CloseableHttpClient client = HttpClients.createDefault();
        HttpGet method = new HttpGet(base(path));
        CloseableHttpResponse response = null;
        try {
            response = client.execute(method);
            return response.getStatusLine().getStatusCode() == 200;
        } catch (IOException e) {
            return false;
        }
    }

    @Override
    public long size(String path) {
        return 0;
    }
}

