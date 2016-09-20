package applica.framework.library.responses;

public class UploadResponse extends SimpleResponse {
    String filename;
    String path;

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }
}
