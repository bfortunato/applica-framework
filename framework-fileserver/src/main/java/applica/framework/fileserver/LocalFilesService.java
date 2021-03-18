package applica.framework.fileserver;

import applica.framework.fileserver.FilesService;
import applica.framework.library.options.OptionsManager;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;

import java.io.IOException;
import java.io.InputStream;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 4/22/13
 * Time: 11:30 AM
 */

public class LocalFilesService {

    private FilesService filesService;

    public void init(OptionsManager options) {
        String basePath = null;
        basePath = options.get("applica.framework.fileserver.basePath");

        if (StringUtils.isEmpty(basePath)) {
            throw new RuntimeException("Could not determine fileserver base");
        }

        filesService = new FilesService(basePath);
    }


    protected InputStream doGet(String path) throws IOException {
        return filesService.get(path);
    }


    protected void doPost(InputStream inputStream, String path, boolean overwrite) throws IOException {
        filesService.save(path, inputStream, overwrite);
    }

    protected void doDelete(String path) {
        filesService.delete(path);
    }
}
