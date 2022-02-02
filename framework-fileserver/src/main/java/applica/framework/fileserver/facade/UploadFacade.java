package applica.framework.fileserver.facade;

import applica.framework.fileserver.FilenameGenerator;
import applica.framework.fileserver.FsClient;
import applica.framework.fileserver.viewmodel.UIFileUpload;
import applica.framework.fileserver.viewmodel.UIImageUpload;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

import java.io.IOException;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 07/03/14
 * Time: 13:06
 */
public class UploadFacade {

    @Autowired
    private FsClient fileServer;

    /**
     * Uploads a generic image to images server
     * @param data
     * @return the path of inserted image
     */
    public String uploadImage(UIImageUpload data) throws EmptyFileException, IOException {
        Assert.notNull(data, "Data cannot be null");

        if(data.getImage() == null || data.getImage().isEmpty()) {
            throw new EmptyFileException();
        }

        if(data.getPath().startsWith("/")) {
            data.setPath(data.getPath().substring(1));
        }

        var path = FilenameGenerator.generate("images/".concat(data.getPath()));
        fileServer.saveImage(path, data.getImage().getInputStream(), true);

        return path;
    }

    public String uploadFile(UIFileUpload data) throws EmptyFileException, IOException {
        Assert.notNull(data, "Data cannot be null");

        if(data.getFile() == null || data.getFile().isEmpty()) {
            throw new EmptyFileException();
        }

        if(data.getPath().startsWith("/")) {
            data.setPath(data.getPath().substring(1));
        }

        String path = "files/".concat(data.getPath());

        if(data.getPath().startsWith("/")) {
            data.setPath(data.getPath().substring(1));
        }

        var generatedPath = FilenameGenerator.generate(path);
        fileServer.saveFile(generatedPath, data.getFile().getInputStream(), true);

        return generatedPath;
    }

}
