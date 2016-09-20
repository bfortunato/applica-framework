package applica.framework.library.utils;

import java.io.File;

public interface FileWalkerListener {
    void onFile(File directory, File file);

    void onDirectory(File file);
}