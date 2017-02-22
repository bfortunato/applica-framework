package applica.framework;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Created by bimbobruno on 17/09/15.
 */
public class AEntity implements Entity {

    public enum IdStrategy {
        Object,
        String,
        Long,
        Int
    }

    public static IdStrategy strategy = IdStrategy.Object;

    private Object id;

    @Override
    public Object getId() {
        return checkedId(id);
    }

    @Override
    public void setId(Object id) {
        this.id = checkedId(id);
    }

    @JsonIgnore
    public String getSid() {
        return SEntity.checkedId(id);
    }

    @JsonIgnore
    public long getLid() {
        return LEntity.checkedId(id);
    }

    @JsonIgnore
    public int getIid() {
        return IEntity.checkedId(id);
    }

    public static Object checkedId(Object id) {
        switch (strategy) {
            case String:
                return SEntity.checkedId(id);
            case Int:
                return IEntity.checkedId(id);
            case Long:
                return LEntity.checkedId(id);
        }

        return id;
    }

    public static Object nullId() {
        return AEntity.checkedId(null);
    }
}
