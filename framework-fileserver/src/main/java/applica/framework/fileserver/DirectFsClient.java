package applica.framework.fileserver;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

import java.io.IOException;
import java.io.InputStream;

public class DirectFsClient implements FsClient {

    private final FilesService filesService;
    private final ImagesService imagesService;

    @Autowired
    public DirectFsClient(FilesService filesService, ImagesService imagesService) {
        this.filesService = filesService;
        this.imagesService = imagesService;
    }

    private Log logger = LogFactory.getLog(getClass());

    @Override
    public void saveFile(String path, InputStream fileStream, boolean overwrite) throws IOException {
        Assert.hasLength(path, "Please provide a valid path");

        logger.info(String.format("Saving file on path %s", path));

        filesService.save(path, fileStream, overwrite);
    }

    @Override
    public InputStream getFile(String path) throws IOException {
        Assert.hasLength(path, "Please provide a valid path");

        return filesService.get(path);
    }

    @Override
    public InputStream getImage(String path, String size) throws IOException {
        Assert.hasLength(path, "Please provide a valid path");

        return imagesService.get(path, size);
    }

    @Override
    public void deleteFile(String path) throws IOException {
        Assert.hasLength(path, "Please provide a valid path");

        filesService.delete(path);
    }

    @Override
    public void saveImage(String path, InputStream imageStream, boolean overwrite) throws IOException {
        Assert.hasLength(path, "Please provide a valid path");

        saveFile(path, imageStream, overwrite);
    }

    @Override
    public boolean exists(String path) {
       return filesService.exists(path);
    }

    @Override
    public long size(String path) {
        return filesService.size(path);
    }
}
