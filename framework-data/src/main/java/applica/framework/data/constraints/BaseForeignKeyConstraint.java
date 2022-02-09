package applica.framework.data.constraints;

import applica.framework.Entity;

public class BaseForeignKeyConstraint<T1 extends Entity, T2 extends Entity> extends ForeignKeyConstraint<T1, T2> {
    private Class<T1> primaryType;
    private Class<T2> foreignType;
    private String foreignProperty;

    public BaseForeignKeyConstraint(Class<T1> primaryType, Class<T2> foreignType, String foreignProperty) {
        this.primaryType = primaryType;
        this.foreignType = foreignType;
        this.foreignProperty = foreignProperty;
    }

    @Override
    public Class<T1> getPrimaryType() {
        return primaryType;
    }

    public void setPrimaryType(Class<T1> primaryType) {
        this.primaryType = primaryType;
    }

    @Override
    public Class<T2> getForeignType() {
        return foreignType;
    }

    public void setForeignType(Class<T2> foreignType) {
        this.foreignType = foreignType;
    }

    @Override
    public String getForeignProperty() {
        return foreignProperty;
    }

    public void setForeignProperty(String foreignProperty) {
        this.foreignProperty = foreignProperty;
    }
}
