package applica.framework.fileserver.fs;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

public interface FileSystem {
    void save(String path, InputStream inputStream, boolean overwrite) throws IOException;
    void delete(String path);
    InputStream get(String path) throws FileNotFoundException;
    boolean exists(String path);
}
