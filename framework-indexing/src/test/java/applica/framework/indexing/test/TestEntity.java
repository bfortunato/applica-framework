package applica.framework.indexing.test;

import applica.framework.AEntity;

import java.util.Date;

public class TestEntity extends AEntity {
    private final boolean booleanValue;
    private final String textValue;
    private int intValue;
    private float floatValue;
    private String stringValue;
    private double doubleValue;
    private long longValue;
    private Date dateValue;


    public TestEntity(int intValue, float floatValue, String stringValue, double doubleValue, long longValue, Date dateValue, boolean booleanValue, String textValue) {
        setId(intValue);
        this.intValue = intValue;
        this.floatValue = floatValue;
        this.stringValue = stringValue;
        this.doubleValue = doubleValue;
        this.longValue = longValue;
        this.dateValue = dateValue;
        this.booleanValue = booleanValue;
        this.textValue = textValue;
    }

    public int getIntValue() {
        return intValue;
    }

    public void setIntValue(int intValue) {
        this.intValue = intValue;
    }

    public float getFloatValue() {
        return floatValue;
    }

    public void setFloatValue(float floatValue) {
        this.floatValue = floatValue;
    }

    public String getStringValue() {
        return stringValue;
    }

    public void setStringValue(String stringValue) {
        this.stringValue = stringValue;
    }

    public Object getDoubleValue() {
        return doubleValue;
    }

    public void setDoubleValue(double doubleValue) {
        this.doubleValue = doubleValue;
    }

    public long getLongValue() {
        return longValue;
    }

    public void setLongValue(long longValue) {
        this.longValue = longValue;
    }

    public Date getDateValue() {
        return dateValue;
    }

    public void setDateValue(Date dateValue) {
        this.dateValue = dateValue;
    }

    public boolean isBooleanValue() {
        return booleanValue;
    }

    public String getTextValue() {
        return textValue;
    }
}
