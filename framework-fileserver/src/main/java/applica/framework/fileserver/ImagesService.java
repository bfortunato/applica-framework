package applica.framework.fileserver;

import applica.framework.fileserver.image.resizer.DefaultImageResizer;
import applica.framework.fileserver.image.resizer.ImageResizer;
import applica.framework.library.options.OptionsManager;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.imgscalr.Scalr;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 4/22/13
 * Time: 12:48 PM
 */
public class ImagesService implements InitializingBean {
    private ImageSize maxSize;
    private String basePath;

    private final FilesService filesService;
    private final OptionsManager options;

    @Autowired(required = false)
    private ImageResizer imageResizer;

    private Log logger = LogFactory.getLog(getClass());

    public ImagesService(FilesService filesService, OptionsManager options) {
        this.filesService = filesService;
        this.options = options;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        if (imageResizer == null) {
            imageResizer = new DefaultImageResizer();
        }

        basePath = options.get("applica.framework.fileserver.basePath");
        var maxSize = options.get("applica.framework.fileserver.images.maxSize");

        Assert.hasLength(basePath, "Please set applica.framework.fileserver.basePath options");
        Assert.hasLength(maxSize, "Please set applica.framework.fileserver.maxSize options");

        this.maxSize = new ImageSize(maxSize, false);
    }

    public void save(String path, InputStream inputStream, boolean overwrite) throws IOException, BadImageException {
        BufferedImage image = ImageIO.read(inputStream);
        if(image != null) {
            //check if image size is larger that allowed max size
            if(image.getHeight() > maxSize.height || image.getWidth() > maxSize.width) {
                float scaleX = (float)image.getWidth() / (float)maxSize.width;
                float scaleY = (float)image.getHeight() / (float)maxSize.height;
                float scale = Math.max(scaleX, scaleY);

                image = Scalr.resize(image, Scalr.Method.AUTOMATIC, Scalr.Mode.FIT_EXACT, (int)(image.getHeight() / scale), (int)(image.getWidth() / scale));
            }

            String format = FilenameUtils.getExtension(path);

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            ImageIO.write(image, format, out);
            IOUtils.closeQuietly(out);
            ByteArrayInputStream in = new ByteArrayInputStream(out.toByteArray());
            filesService.save(path, in, overwrite);
            IOUtils.closeQuietly(in);
        } else {
            throw new BadImageException();
        }
    }

    public void delete(String path) throws IOException {
        filesService.delete(path);
    }

    private String getSizedPath(String path, String size) {
        if (org.apache.commons.lang.StringUtils.isNotEmpty(size)) {
            if (size.equals("default")) {
                return path;
            } else {
                var extension = FilenameUtils.getExtension(path);
                return String.format("%s-cache/%s.%s", path, size.replace("*", "_"), extension);
            }
        } else {
            return path;
        }
    }

    public InputStream get(String path, String size) throws FileNotFoundException, IOException {
        if(!StringUtils.hasLength(size)) {
            size = "default";
        }

        if (!size.equals("default")) {
            if (filesService.exists(getSizedPath(path, size))) {
                logger.info("Image getted from cache: " + path + " (" + size + ")");
                return filesService.get(getSizedPath(path, size));
            }
        }

        if (!filesService.exists(path)) {
            throw new FileNotFoundException("Default image not saved: " + path);
        }

        var imageData = filesService.get(path);

        if ("default".equals(size)) {
            return imageData;
        } else {
            var format = FilenameUtils.getExtension(path);
            var output = new ByteArrayOutputStream();
            imageResizer.resize(imageData, format, size, output);

            var data = output.toByteArray();

            filesService.save(getSizedPath(path, size), new ByteArrayInputStream(data), true);
            logger.info("Image cached: " + path + " (" + size + ")");

            return new ByteArrayInputStream(data);
        }
    }

}
