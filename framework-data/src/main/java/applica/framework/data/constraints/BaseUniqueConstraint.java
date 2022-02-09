package applica.framework.data.constraints;

import applica.framework.Entity;

public class BaseUniqueConstraint<T extends Entity> extends UniqueConstraint<T> {

    private Class<T> type;
    private String property;

    public BaseUniqueConstraint(Class<T> entityType, String property) {
        this.type = entityType;
        this.property = property;
    }

    @Override
    public Class<T> getType() {
        return type;
    }

    public void setType(Class<T> type) {
        this.type = type;
    }

    @Override
    public String getProperty() {
        return property;
    }

    public void setProperty(String property) {
        this.property = property;
    }
}
