package applica.framework.fileserver;

import applica.framework.library.options.OptionsManager;
import net.lingala.zip4j.core.ZipFile;
import net.lingala.zip4j.exception.ZipException;
import net.lingala.zip4j.model.FileHeader;
import org.apache.commons.io.FilenameUtils;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import javax.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
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
        String fullPath = FilenameUtils.concat(normalizedUrl.url, generatedName);

        logger.info(String.format("Saving file on path %s", fullPath));

        saveToServer(fileStream, generatedName, baseUrl.concat(fullPath));

        return fullPath;
    }

    private void saveToServer(InputStream fileStream, String filename, String fullPath) throws IOException {
        CloseableHttpClient client = HttpClients.createDefault();
        HttpPost method = new HttpPost(fullPath);
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

    @Override
    public InputStream getFile(String path) throws IOException {
        Assert.hasLength(path, "Please provide a valid path");
        NormalizedUrl normalizedUrl = normalizeUrl(path);

        CloseableHttpClient client = HttpClients.createDefault();
        HttpGet method = new HttpGet(baseUrl.concat(normalizedUrl.url));
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
        NormalizedUrl normalizedUrl = normalizeUrl(path);

        CloseableHttpClient client = HttpClients.createDefault();
        String fullUrlWithParams = baseUrl.concat(normalizedUrl.url);
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
        NormalizedUrl normalizedUrl = normalizeUrl(path);

        CloseableHttpClient client = HttpClients.createDefault();
        HttpDelete method = new HttpDelete(baseUrl.concat(normalizedUrl.url));
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

    public String unzipFile(String filePath) {
        if (!filePath.endsWith(".zip")){
            throw new RuntimeException("Cannot unzip the file because isn't zip");
        }
        String basePath = options.get("applica.framework.fileserver.basePath");
        String filePathFull = String.format("%s/%s", basePath, filePath);
        ZipFile zipFile = null;
        String destinationPath = null;
        try {
            zipFile = new ZipFile(filePathFull);
            String[] strings = filePath.split("/");
            destinationPath = filePath.replace(strings[strings.length-1], "");
            zipFile.extractAll(String.format("%s/%s", basePath, destinationPath));

            FileHeader fileHeader = (FileHeader) zipFile.getFileHeaders().get(0);
            String path = String.format("%s%s", destinationPath, fileHeader.getFileName());;
            return path;
        } catch (ZipException e) {
            throw new RuntimeException(e);
        }
    }
}
