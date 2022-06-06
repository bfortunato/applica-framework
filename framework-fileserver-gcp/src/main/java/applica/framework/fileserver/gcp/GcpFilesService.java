package applica.framework.fileserver.gcp;

import applica.framework.fileserver.FilesService;
import applica.framework.library.options.OptionsManager;
import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.storage.*;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.core.io.ResourceLoader;
import org.springframework.util.Assert;

import java.io.ByteArrayInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

public class GcpFilesService implements FilesService, InitializingBean {

    private Log logger = LogFactory.getLog(getClass());

    private final OptionsManager options;
    private final ResourceLoader resourceLoader;

    private String credentials;
    private String projectId;
    private String bucketName;
    private Storage storage;

    public GcpFilesService(OptionsManager options, ResourceLoader resourceLoader) {
        this.options = options;
        this.resourceLoader = resourceLoader;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        credentials = options.get("applica.framework.fileserver.gcp.credentials");
        projectId = options.get("applica.framework.fileserver.gcp.projectId");
        bucketName = options.get("applica.framework.fileserver.gcp.bucketName");
        Assert.hasLength(credentials, "please set applica.framework.fileserver.gcp.credentials option");
        Assert.hasLength(projectId, "please set applica.framework.fileserver.gcp.projectId option");
        Assert.hasLength(bucketName, "please set applica.framework.fileserver.gcp.bucketName option");

        storage = StorageOptions.newBuilder()
                .setProjectId(projectId)
                .setCredentials(ServiceAccountCredentials.fromStream(resourceLoader.getResource(credentials).getInputStream()   ))
                .build()
                .getService();
    }

    @Override
    public void save(String path, InputStream inputStream, boolean overwrite) throws IOException {
        BlobId blobId = BlobId.of(bucketName, path);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
        storage.createFrom(blobInfo, inputStream);

        logger.info(String.format("File %s saved to GCP bucket %s", path, blobInfo.toString()));
    }

    @Override
    public void delete(String path) {
        Blob blob = storage.get(BlobId.of(bucketName, path));
        if (blob != null) {
            blob.delete();
            logger.info(String.format("File %s deleted to GCP bucket %s", path, blob));
        }
    }

    @Override
    public InputStream get(String path) throws FileNotFoundException {
        Blob blob = storage.get(BlobId.of(bucketName, path));
        if (blob == null || !blob.exists()) {
            throw new FileNotFoundException(path);
        }
        var result = new ByteArrayInputStream(blob.getContent());

        logger.info(String.format("File %s loaded from GCP bucket %s", path, blob));

        return result;
    }

    @Override
    public boolean exists(String path) {
        Blob blob = storage.get(BlobId.of(bucketName, path));
        if (blob != null) {
            return blob.exists();
        }

        return false;
    }

    @Override
    public long size(String path) {
        Blob blob = storage.get(BlobId.of(bucketName, path));
        var size = blob.getSize();

        return size != null ? size : 0;
    }


}
