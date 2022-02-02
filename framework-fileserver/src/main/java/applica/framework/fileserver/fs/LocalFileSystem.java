package applica.framework.fileserver.fs;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;

import java.io.*;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 4/22/13
 * Time: 12:03 PM
 */
public class LocalFileSystem implements FileSystem {

    private String basePath = null;

    public LocalFileSystem(String basePath) {
        this.basePath = basePath;
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

    public String getLocalPath(String path) {
        return basePath.concat(path).replace("//", "/");
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
