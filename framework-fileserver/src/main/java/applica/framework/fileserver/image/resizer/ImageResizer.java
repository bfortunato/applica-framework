package applica.framework.fileserver.image.resizer;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public interface ImageResizer {
    void resize(InputStream imageData, String format, String size, OutputStream output) throws IOException;
}
