package applica.framework.library.dynaimg;

import java.awt.*;
import java.awt.geom.Rectangle2D;
import java.awt.image.BufferedImage;
import java.util.Objects;

/**
 * Created by bimbobruno on 28/01/15.
 */
public class DynaimgGenerator {

    private int height = 300;
    private int width = 300;
    private Color backgroundColor = Color.BLUE;
    private Font textFont = new Font("sans-serif", Font.BOLD, 128);
    private String text;
    private Color foregroundColor;

    private String getDrawableString() {
        return text.toUpperCase();
    }

    public BufferedImage generate() {
        Objects.requireNonNull(backgroundColor, "Background color is null");
        Objects.requireNonNull(foregroundColor, "Foreground color is null");
        Objects.requireNonNull(textFont, "Font color is null");

        BufferedImage img = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = img.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
        g.setBackground(backgroundColor);
        g.setColor(foregroundColor);
        float fontSize = Math.min(height, width) / 2;
        g.setFont(textFont.deriveFont(fontSize));
        g.clearRect(0, 0, width, height);
        String text = getDrawableString();
        Rectangle2D bounds = g.getFontMetrics().getStringBounds(text, g);
        double x = width / 2 - bounds.getWidth() / 2;
        double y = height / 2 - bounds.getHeight() / 2 - bounds.getY();
        g.drawString(text, (float) x, (float) y);
        g.dispose();

        return img;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public Color getBackgroundColor() {
        return backgroundColor;
    }

    public void setBackgroundColor(Color backgroundColor) {
        this.backgroundColor = backgroundColor;
    }

    public Font getTextFont() {
        return textFont;
    }

    public void setTextFont(Font textFont) {
        this.textFont = textFont;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }

    public void setForegroundColor(Color foregroundColor) {
        this.foregroundColor = foregroundColor;
    }

    public Color getForegroundColor() {
        return foregroundColor;
    }
}
