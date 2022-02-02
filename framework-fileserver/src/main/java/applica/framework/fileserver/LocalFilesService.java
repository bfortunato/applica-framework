package applica.framework.fileserver;

import applica.framework.library.options.OptionsManager;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.util.Assert;

import java.io.*;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 4/22/13
 * Time: 12:03 PM
 */
public class LocalFilesService implements FilesService, InitializingBean {

    private String basePath = null;

    private final OptionsManager options;

    public LocalFilesService(OptionsManager options) {
        this.options = options;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        this.basePath = options.get("applica.framework.fileserver.basePath");

        Assert.hasLength(basePath, "Please set applica.framework.fileserver.basePath options");;
    }

    @Override
    public void save(String path, InputStream inputStream, boolean overwrite) throws IOException {
        createFolderIfNotExists(getLocalPath(path));

        if (!overwrite) {
            if (exists(path)) {
                throw new IOException("File already exists");
            }
        }
        IOUtils.copy(inputStream, new FileOutputStream(getLocalPath(path)));
    }

    @Override
    public void delete(String path) {
        File fileToDelete = new File(getLocalPath(path));
        fileToDelete.delete();
    }

    @Override
    public InputStream get(String path) throws FileNotFoundException {
        return new FileInputStream(getLocalPath(path));
    }

    @Override
    public boolean exists(String path) {
        File file = new File(getLocalPath(path));
        return file.exists();
    }

    @Override
    public long size(String path) {
        if (exists(path)) {
            return new File(getLocalPath(path)).length();
        }

        return 0;
    }

    public String getLocalPath(String path) {
        return FilenameUtils.concat(basePath, path);
    }

    private void createFolderIfNotExists(String localPath) {
        String folder = FilenameUtils.getFullPath(localPath);
        try {
            FileUtils.forceMkdir(new File(folder));
        } catch (IOException e) {
            throw new RuntimeException("Cannot create folder " + folder, e);
        }
    }
}
