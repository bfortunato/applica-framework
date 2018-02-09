package applica.framework.widgets.mapping;

import applica.framework.AEntity;

/**
 * Created by antoniolovicario on 31/08/17.
 */

//TODO: spostare in un package più appropriato
public class Attachment extends AEntity {
    private String path;
    private String name;
    private int size;

    public Attachment(){

    }
    public Attachment(String filename, String filePath, int size) {
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

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }
}
