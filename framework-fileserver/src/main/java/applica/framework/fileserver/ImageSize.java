package applica.framework.fileserver;

import org.springframework.util.Assert;

public class ImageSize {
    public static final int AUTO = 0;

    public ImageSize(String size) {
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

    public int height;
    public int width;

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
