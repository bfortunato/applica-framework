package applica.framework.fileserver;

import org.apache.commons.io.FilenameUtils;

import java.util.UUID;

public class FilenameGenerator {

    public static String generate(String directory, String extension) {
        String generatedName = String.format("%s.%s", UUID.randomUUID().toString().replace("-", "_"), extension);

        return FilenameUtils.concat(directory, generatedName);
    }

    public static String generate(String path) {
        var directory = FilenameUtils.getFullPath(path);
        var extension = FilenameUtils.getExtension(path);

        return generate(directory, extension);
    }


}
