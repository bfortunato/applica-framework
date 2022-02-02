package applica.framework.fileserver;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

public interface FilesService {
    void save(String path, InputStream inputStream, boolean overwrite) throws IOException;

    void delete(String path);

    InputStream get(String path) throws FileNotFoundException;

    boolean exists(String path);

    long size(String path);
}
