package applica.framework;

import applica.framework.AEntity;

/**
 * Created by antoniolovicario on 31/08/17.
 */

public class Attachment extends AEntity {
    private String path;
    private String name;
    private long size;

    public Attachment(){

    }
    public Attachment(String filename, String filePath, long size) {
        this.name = filename;
        this.path = filePath;
        this.size = size;

    }



    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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
