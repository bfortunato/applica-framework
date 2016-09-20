package applica.framework.library.utils;

import org.springframework.util.Assert;

import java.util.Date;
import java.util.stream.Stream;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 26/11/14
 * Time: 15:15
 */
public class PrimitiveValueConverter {

    private static final Class<?>[] CONVERTIBLE_TYPES = new Class<?>[] {
            Integer.class,
            Float.class,
            Double.class,
            Boolean.class,
            Byte.class,
            Short.class,
            Long.class
    };

    private Object value;

    public PrimitiveValueConverter(Object value) {
        this.value = value;
    }

    public boolean isConvertible() {
        if (value == null) {
            return false;
        }

        if (value.getClass().isPrimitive()) {
            return true;
        }

        return Stream.of(CONVERTIBLE_TYPES).anyMatch(c -> c.equals(value.getClass()));
    }

    public Class<?> primitiveType() {
        Assert.isTrue(isConvertible());
        if (value.getClass().isPrimitive()) {
            return value.getClass();
        }

        if (value.getClass().equals(Integer.class)) {
           return int.class;
        } else if (value.getClass().equals(Float.class)) {
           return float.class;
        } else if (value.getClass().equals(Double.class)) {
            return double.class;
        } else if (value.getClass().equals(Boolean.class)) {
           return boolean.class;
        } else if (value.getClass().equals(Byte.class)) {
           return byte.class;
        } else if (value.getClass().equals(Short.class)) {
           return short.class;
        } else if (value.getClass().equals(Long.class)) {
           return long.class;
        }

        throw new RuntimeException("Inconvertible primitive type");
    }

    public int intValue() {
        Assert.isTrue(primitiveType().equals(int.class));
        return (int) value;
    }

    public float floatValue() {
        Assert.isTrue(primitiveType().equals(float.class));
        return (float) value;
    }

    public double doubleValue() {
        Assert.isTrue(primitiveType().equals(double.class));
        return (double) value;
    }

    public boolean booleanValue() {
        Assert.isTrue(primitiveType().equals(boolean.class));
        return (boolean) value;
    }

    public byte byteValue() {
        Assert.isTrue(primitiveType().equals(byte.class));
        return (byte) value;
    }

    public short shortValue() {
        Assert.isTrue(primitiveType().equals(short.class));
        return (short) value;
    }

    public long longValue() {
        Assert.isTrue(primitiveType().equals(long.class));
        return (long) value;
    }

}
