package applica.framework.fileserver;

import java.io.IOException;
import java.io.InputStream;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 29/10/13
 * Time: 15:11
 */
public interface FsClient {
    /**
     * Save file to file server. Do not specify full name of file, just path and extension. FileServer generates
     * a unique filename for you. Path must be relative to file server url: es: /files/users/documents/
     * @param path The path to save the file
     * @param fileStream The content of the file
     * @throws IOException
     */
    void saveFile(String path, InputStream fileStream, boolean overwrite) throws IOException;

    /**
     * Get file in specified path. Path must be relative to file server url: es: /files/users/documents/filename.ext
     * @param path The full path of the file (including filename)
     * @return
     * @throws IOException
     */
    InputStream getFile(String path) throws IOException;

    /**
     * Get image in specified path. Path must be relative to file server url: es: /files/users/documents/image.jpg
     * @param path The full path of the image (including filename)
     * @param size Required image size (es: 300x240)
     * @return
     * @throws IOException
     */
    InputStream getImage(String path, String size) throws IOException;

    /**
     * Delete file in specified path. Path must be relative to file server url: es: /files/users/documents/filename.ext
     * @param path The full path of the file (including filename)
     * @return
     * @throws IOException
     */
    void deleteFile(String path) throws IOException;

    /**
     * Save image to file server. Do not specify full name of image, just path and extension. FileServer generates
     * a unique filename for you. Path must be relative to file server url: es: /files/users/documents/
     * @param path The path to save the image
     * @param imageStream The content of the image
     * @param overwrite
     * @return The full path (including generated file name) of the saved image
     * @throws IOException
     */
    void saveImage(String path, InputStream imageStream, boolean overwrite) throws IOException;

    /**
     * Returns true if path exists on file system
     * @param path
     * @return
     */
    boolean exists(String path);

    /**
     * Returns size of file
     * @param path
     * @return
     */
    long size(String path);

}
