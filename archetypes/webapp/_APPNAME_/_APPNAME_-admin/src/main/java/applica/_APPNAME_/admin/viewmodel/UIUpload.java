package applica._APPNAME_.admin.viewmodel;

import org.springframework.web.multipart.commons.CommonsMultipartFile;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 3/1/13
 * Time: 1:28 PM
 */
public class UIUpload {
    private CommonsMultipartFile file;
    private String data;

    public CommonsMultipartFile getFile() {
        return file;
    }

    public void setFile(CommonsMultipartFile file) {
        this.file = file;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }
}
