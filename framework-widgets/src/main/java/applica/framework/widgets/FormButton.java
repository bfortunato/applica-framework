package applica.framework.widgets;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 4/18/13
 * Time: 8:46 AM
 */
public class FormButton {
    public static final String SUBMIT = "submit";
    public static final String BUTTON = "button";

    private String label = "Save";
    private String type = SUBMIT;
    private String action;

    public FormButton() {}

    public FormButton(String label, String type, String action) {
        this.label = label;
        this.type = type;
        this.action = action;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }
}
