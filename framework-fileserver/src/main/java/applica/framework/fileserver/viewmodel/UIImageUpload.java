package applica.framework.fileserver.viewmodel;

import org.springframework.web.multipart.MultipartFile;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 5/10/13
 * Time: 5:27 PM
 */
public class UIImageUpload {

    public MultipartFile image;
    public String path;

    public MultipartFile getImage() {
        return image;
    }

    public void setImage(MultipartFile image) {
        this.image = image;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }
}
