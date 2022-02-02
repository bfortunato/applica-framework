package applica.framework.fileserver.image.resizer;

import applica.framework.fileserver.ImageSize;
import org.imgscalr.Scalr;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;

public class DefaultImageResizer implements ImageResizer {

    @Override
    public void resize(InputStream imageData, String format, String size, OutputStream output) throws IOException {
        BufferedImage defaultImage = ImageIO.read(imageData);
        ImageSize imageSize = new ImageSize(size);
        imageSize.computeAutoSizes(defaultImage.getWidth(), defaultImage.getHeight());

        BufferedImage croppedImage = createCroppedImage(defaultImage, imageSize);
        BufferedImage scaledImage = Scalr.resize(croppedImage, Scalr.Method.AUTOMATIC, Scalr.Mode.FIT_EXACT, imageSize.width, imageSize.height);

        ImageIO.write(scaledImage, format, output);
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

        return Scalr.crop(image, cropX, cropY, cropWidth, cropHeigth);
    }
}
