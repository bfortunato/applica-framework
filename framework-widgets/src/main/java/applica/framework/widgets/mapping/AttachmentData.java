package applica.framework.widgets.mapping;

//TODO: spostare in un package più appropriato
public class AttachmentData {
    private long size;
    private String filename;
    private String data;
    private boolean base64;

    public AttachmentData(){}

    public AttachmentData(String filename, String data, boolean base64, long size){
        this.filename = filename;
        this.data = data;
        this.base64 = base64;
        this.size = size;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public boolean isBase64() {
        return base64;
    }

    public void setBase64(boolean base64) {
        this.base64 = base64;
    }

    public long getSize() {
        return size;
    }

    public void setSize(long size) {
        this.size = size;
    }
}
