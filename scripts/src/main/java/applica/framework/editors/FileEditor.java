package applica.framework.editors;

import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import java.io.*;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 25/07/14
 * Time: 17:43
 */
public class FileEditor {

    private File source;
    private File destination;
    private String search;
    private String replace;

    public FileEditor(File source, File destination, String search, String replace) {
        this.source = source;
        this.destination = destination;
        this.search = search;
        this.replace = replace;
    }

    public FileEditor() { }

    public File getSource() {
        return source;
    }

    public void setSource(File source) {
        this.source = source;
    }

    public File getDestination() {
        return destination;
    }

    public void setDestination(File destination) {
        this.destination = destination;
    }

    public String getSearch() {
        return search;
    }

    public void setSearch(String search) {
        this.search = search;
    }

    public String getReplace() {
        return replace;
    }

    public void setReplace(String replace) {
        this.replace = replace;
    }

    public void save() {
        Assert.notNull(source);
        Assert.notNull(destination);
        Assert.isTrue(StringUtils.hasLength(search));
        Assert.isTrue(StringUtils.hasLength(replace));
        Assert.isTrue(source.exists());
        Assert.isTrue(!destination.exists());

        try {
            InputStream in = new FileInputStream(source);
            OutputStream out = new FileOutputStream(destination);
            BufferedReader reader = new BufferedReader(new InputStreamReader(in));
            BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(out));

            String line;
            while ((line = reader.readLine()) != null) {
                String newLine = line.replace(search, replace);
                writer.write(String.format("%s\n", newLine));
            }

            reader.close();
            writer.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
