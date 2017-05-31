package applica.framework;

/**
 * Created by iaco on 17/01/17.
 */
public class GeoFilter {
    //ragiud in km. Eg: 1.5 1,5 km
    private Double radius;
    private double centerLat;
    private double centerLng;

    public GeoFilter(Double radius, double centerLat, double centerLng) {
        this.radius = radius;
        this.centerLat = centerLat;
        this.centerLng = centerLng;
    }

    public Double getRadius() {
        return radius / 6371.0;
    }

    public void setRadius(Double radius) {
        this.radius = radius;
    }

    public double getCenterLat() {
        return centerLat;
    }

    public void setCenterLat(double centerLat) {
        this.centerLat = centerLat;
    }

    public double getCenterLng() {
        return centerLng;
    }

    public void setCenterLng(double centerLng) {
        this.centerLng = centerLng;
    }
}
