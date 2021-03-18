package applica.framework.fileserver;

import applica.framework.fileserver.BadImageException;
import applica.framework.fileserver.ImagesService;
import applica.framework.library.options.OptionsManager;
import org.apache.commons.lang3.StringUtils;

import javax.annotation.PostConstruct;
import javax.servlet.ServletException;
import java.io.IOException;
import java.io.InputStream;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 4/22/13
 * Time: 11:30 AM
 */
public class LocalImagesService {

    private ImagesService imagesService;

    public void init(OptionsManager options) {
        String basePath = null;
        String maxSize = null;

        basePath = options.get("applica.framework.fileserver.basePath");
        maxSize = options.get("applica.framework.fileserver.images.maxSize");
        if (StringUtils.isEmpty(basePath)) {
            throw new RuntimeException("Could not determine fileserver base");
        }

        imagesService = new ImagesService(basePath, maxSize);
    }



    protected InputStream doGet(String path, String size) throws IOException {
        return  imagesService.get(path, size);
    }


    protected void doPost(InputStream inputStream, String path, boolean overwrite) throws IOException {
        try {
            imagesService.save(path, inputStream, overwrite);
        } catch (BadImageException e) {
            e.printStackTrace();
            throw new IOException(e.getMessage());
        }
    }

    protected void doDelete(String path) throws ServletException, IOException {
        imagesService.delete(path);
    }
}
