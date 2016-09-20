package applica.framework.fileserver;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.imgscalr.Scalr;
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
public class ImagesService {

    private ImageSize maxSize;
    private String basePath;
    private FilesService filesService;

    public ImagesService(String basePath, String maxSize) {
        filesService = new FilesService(basePath);
        this.basePath = basePath;
        this.maxSize = new ImageSize(maxSize);
    }

    public void save(String path, InputStream inputStream, boolean overwrite) throws IOException, BadImageException {
        //delete old images with the same path
        delete(path);

        BufferedImage image = ImageIO.read(inputStream);
        if(image != null) {
            //check if image size is larger that allowed max size
            if(image.getHeight() > maxSize.height || image.getWidth() > maxSize.width) {
                float scaleX = (float)image.getWidth() / (float)maxSize.width;
                float scaleY = (float)image.getHeight() / (float)maxSize.height;
                float scale = Math.max(scaleX, scaleY);

                image = Scalr.resize(image, Scalr.Method.AUTOMATIC, Scalr.Mode.FIT_EXACT, (int)(image.getHeight() / scale), (int)(image.getWidth() / scale));
            }

            String sizedPath = getSizedPath(path, "default");
            String format = FilenameUtils.getExtension(path);

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            ImageIO.write(image, format, out);
            IOUtils.closeQuietly(out);
            ByteArrayInputStream in = new ByteArrayInputStream(out.toByteArray());
            filesService.save(sizedPath, in, overwrite);
            IOUtils.closeQuietly(in);
        } else {
            throw new BadImageException();
        }
    }

    public void delete(String path) throws IOException {
        String imageRoot = filesService.getLocalPath(getImageRoot(path));
        FileUtils.deleteDirectory(new File(imageRoot));
    }

    public InputStream get(String path, String size) throws FileNotFoundException, IOException {
        if(!StringUtils.hasLength(size)) {
            size = "default";
        }

        String sizedPath = getSizedPath(path, size);
        if(!filesService.exists(sizedPath)) {
            if("default".equals(size)) {
                throw new FileNotFoundException("Default image not saved: " + path);
            }

            createNewSizeImage(path, size);
        }

        return filesService.get(sizedPath);
    }

    private void createNewSizeImage(String path, String size) throws FileNotFoundException, IOException {
        BufferedImage defaultImage = ImageIO.read(get(path, "default"));
        ImageSize imageSize = new ImageSize(size);
        imageSize.computeAutoSizes(defaultImage.getWidth(), defaultImage.getHeight());

        BufferedImage croppedImage = createCroppedImage(defaultImage, imageSize);
        BufferedImage scaledImage = Scalr.resize(croppedImage, Scalr.Method.AUTOMATIC, Scalr.Mode.FIT_EXACT, imageSize.width, imageSize.height);

        String sizedPath = getSizedPath(path, size);
        String format = FilenameUtils.getExtension(path);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        ImageIO.write(scaledImage, format, out);
        IOUtils.closeQuietly(out);
        ByteArrayInputStream in = new ByteArrayInputStream(out.toByteArray());
        filesService.save(sizedPath, in, true);
        IOUtils.closeQuietly(in);
    }

    private BufferedImage createCroppedImage(BufferedImage image, ImageSize imageSize) {
        int cropWidth;
        int cropHeigth;
        int cropX;
        int cropY;
        float rw = (float)image.getWidth() / (float)imageSize.width;
        float rh = (float)image.getHeight() / (float)imageSize.height;

        if(rw > rh) {
            cropWidth = (int)((float)imageSize.width * rh);
            cropHeigth = (int)((float)imageSize.height * rh);
            cropX = image.getWidth() / 2 - cropWidth / 2;
            cropY = 0;
        } else {
            cropWidth = (int)((float)imageSize.width * rw);
            cropHeigth = (int)((float)imageSize.height * rw);
            cropX = 0;
            cropY = image.getHeight() / 2 - cropHeigth / 2;
        }

        BufferedImage croppedImage = Scalr.crop(image, cropX, cropY, cropWidth, cropHeigth);
        return croppedImage;
    }

    private String getSizedPath(String path, String size) {
        return String.format("%s%s", getImageRoot(path), getSizedFileName(path, size));
    }

    private String getSizedFileName(String path, String size) {
        String extension = FilenameUtils.getExtension(path);
        return String.format("%s.%s", size, extension);
    }

    private String getImageRoot(String path) {
        String directory = FilenameUtils.getFullPath(path);
        String fileName = FilenameUtils.getName(path);
        String imageRoot = String.format("%s%s/", directory, fileName.replace(".", "_"));
        return imageRoot;
    }

    private class ImageSize {
        public static final int AUTO = 0;

        private ImageSize(String size) {
            Assert.hasLength(size, "size cannot be null");
            String[] split = size.split("x");
            Assert.isTrue(split.length == 2, "invalid size format. use 300x200 for example");
            String swidth = split[0];
            String sheight = split[1];
            if(swidth.equals("*") || swidth.equals("0")) {
                width = AUTO;
            } else {
                width = Integer.parseInt(swidth);
            }
            if(sheight.equals("*") || sheight.equals("0")) {
                height = AUTO;
            } else {
                height = Integer.parseInt(sheight);
            }
        }

        private ImageSize() {}

        private int height;
        private int width;

        public void computeAutoSizes(int defaultWidth, int defaultHeight) {
            if(width == AUTO) {
                float ratio = defaultHeight / height;
                width = (int)((float)defaultWidth / ratio);
            } else if(height == AUTO) {
                float ratio = defaultWidth / width;
                height = (int)((float)defaultHeight / ratio);
            }
        }
    }
}
