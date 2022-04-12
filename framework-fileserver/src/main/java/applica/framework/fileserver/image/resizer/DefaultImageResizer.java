package applica.framework.fileserver.image.resizer;

import applica.framework.fileserver.ImageSize;
import org.apache.commons.imaging.ImageReadException;
import org.apache.commons.imaging.ImageWriteException;
import org.apache.commons.imaging.Imaging;
import org.apache.commons.imaging.common.ImageMetadata;
import org.apache.commons.imaging.formats.jpeg.JpegImageMetadata;
import org.apache.commons.imaging.formats.jpeg.exif.ExifRewriter;
import org.apache.commons.imaging.formats.tiff.TiffImageMetadata;
import org.apache.commons.imaging.formats.tiff.constants.TiffTagConstants;
import org.apache.commons.io.IOUtils;
import org.imgscalr.Scalr;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;

public class DefaultImageResizer implements ImageResizer {

    @Override
    public void resize(InputStream imageData, String format, String size, OutputStream output) throws IOException {
        byte[] data = imageData.readAllBytes();

        TiffImageMetadata metadata = null;
        boolean swapSize = false;
        try {
            metadata = readExifMetadata(data);
            var orientation = (short) metadata.getFieldValue(TiffTagConstants.TIFF_TAG_ORIENTATION);
            if (orientation == 8 || orientation == 6 || orientation == 5 || orientation == 7) {
                swapSize = true;
            }

        } catch (Exception e) {
            //impossibile
            e.printStackTrace();
        }

        imageData.reset();

        BufferedImage defaultImage = ImageIO.read(imageData);
        ImageSize imageSize = new ImageSize(size, swapSize);
        imageSize.computeAutoSizes(defaultImage.getWidth(), defaultImage.getHeight());

        BufferedImage croppedImage = createCroppedImage(defaultImage, imageSize);
        BufferedImage scaledImage = Scalr.resize(croppedImage, Scalr.Method.AUTOMATIC, Scalr.Mode.FIT_EXACT, imageSize.width, imageSize.height);

        if (metadata != null) {
            var bout = new ByteArrayOutputStream();
            ImageIO.write(scaledImage, format, bout);
            data = bout.toByteArray();
            try {
                writeExifMetadata(metadata, data, output);
            } catch (ImageReadException | ImageWriteException e) {
                throw new RuntimeException(e);
            }
        } else {
            ImageIO.write(scaledImage, format, output);
        }
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

    private TiffImageMetadata readExifMetadata(byte[] jpegData) throws ImageReadException, IOException {
        ImageMetadata imageMetadata = Imaging.getMetadata(jpegData);
        if (imageMetadata == null) {
            return null;
        }
        JpegImageMetadata jpegMetadata = (JpegImageMetadata) imageMetadata;
        return jpegMetadata.getExif();
    }

    private void writeExifMetadata(TiffImageMetadata metadata, byte[] jpegData, OutputStream out)
            throws ImageReadException, ImageWriteException, IOException {
        new ExifRewriter().updateExifMetadataLossless(jpegData, out, metadata.getOutputSet());
    }
}
