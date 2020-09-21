package applica.framework.widgets.mapping;

import applica.framework.AEntity;

/**
 * Created by antoniolovicario on 31/08/17.
 */

//TODO: spostare in un package più appropriato
public class Attachment extends AEntity {
    private String path;
    private String name;
    private long size;
    private String preview;

    public Attachment(){

    }
    public Attachment(String filename, String filePath, long size) {
        this.name = filename;
        this.path = filePath;
        this.size = size;

    }

    public static String getHumanReadableSize(long size) {
        return org.apache.commons.io.FileUtils.byteCountToDisplaySize(size);
    }

    public String getSizeDescription() {
        return getHumanReadableSize(this.size);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPreview() {
        return preview;
    }

    public void setPreview(String preview) {
        this.preview = preview;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public long getSize() {
        return size;
    }

    public void setSize(long size) {
        this.size = size;
    }
}
