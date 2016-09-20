package applica.framework.fileserver.viewmodel;

import org.springframework.web.multipart.MultipartFile;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 5/11/13
 * Time: 12:16 PM
 */
public class UIFileUpload {

    private MultipartFile file;
    private String path;

    public MultipartFile getFile() {
        return file;
    }

    public void setFile(MultipartFile file) {
        this.file = file;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }
}
