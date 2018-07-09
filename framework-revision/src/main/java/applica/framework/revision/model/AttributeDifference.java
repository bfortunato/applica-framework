package applica.framework.revision.model;

import applica.framework.AEntity;
import applica.framework.revisions.HideRevisionValue;

import java.lang.reflect.Field;

/**
 * Created by Claudio Cannata' on 13/05/2015.
 */
public class AttributeDifference extends AEntity {

    private static final String HIDDEN_VALUE_PLACEHOLDER = "[----]";

    private String name;

    private String previousValue;
    private String newValue;

    private String previousValueDescription;
    private String newValueDescription;


    public AttributeDifference(){}

    public AttributeDifference(Field field, String previousValue, String currentValue, String previousValueDescription, String currentValueDescription) {
        this.name = field.getName();
        boolean hideValue = (field.getAnnotation(HideRevisionValue.class) != null);
        if (previousValue != null) {
            this.previousValue = !hideValue? previousValue : HIDDEN_VALUE_PLACEHOLDER;
        }

        if (currentValue != null) {
            this.newValue = !hideValue? currentValue : HIDDEN_VALUE_PLACEHOLDER;
        }

        if (previousValueDescription != null) {
            this.previousValueDescription = previousValueDescription;
        }

        if (currentValueDescription != null) {
            this.newValueDescription = currentValueDescription;
        }

    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPreviousValue() {
        return previousValue;
    }

    public void setPreviousValue(String previousValue) {
        this.previousValue = previousValue;
    }

    public String getNewValue() {
        return newValue;
    }

    public void setNewValue(String newValue) {
        this.newValue = newValue;
    }

    public String getPreviousValueDescription() {
        return previousValueDescription != null? previousValueDescription : previousValue;
    }

    public void setPreviousValueDescription(String previousValueDescription) {
        this.previousValueDescription = previousValueDescription;
    }

    public String getNewValueDescription() {
        return newValueDescription != null? newValueDescription : newValue;
    }

    public void setNewValueDescription(String newValueDescription) {
        this.newValueDescription = newValueDescription;
    }
}
