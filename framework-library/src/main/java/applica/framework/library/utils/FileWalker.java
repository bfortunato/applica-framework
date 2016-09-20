package applica.framework.library.utils;

import java.io.File;

public class FileWalker {

    public void walk(String path, FileWalkerListener listener) {

        File root = new File(path);
        File[] list = root.listFiles();

        for (File f : list) {
            if (f.isDirectory()) {
                listener.onDirectory(f.getAbsoluteFile());
                walk(f.getAbsolutePath(), listener);
            } else {
                listener.onFile(root, f.getAbsoluteFile());
            }
        }
    }

}