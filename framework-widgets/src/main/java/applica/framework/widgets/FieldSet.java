package applica.framework.widgets;

import java.util.ArrayList;
import java.util.List;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 04/11/14
 * Time: 18:21
 */
public class FieldSet {

    public static final String DEFAULT = "*";

    private String name;
    private int priority;
    private Form form;
    private List<FormField> fields = new ArrayList<>();


    public FieldSet(Form form) {
        this.form = form;
    }

    public String getName() {
        return name;
    }

    public int getPriority() {
        return priority;
    }

    public void setPriority(int priority) {
        this.priority = priority;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Form getForm() {
        return form;
    }

    public List<FormField> getFields() {
        return fields;
    }

    public void setFields(List<FormField> fields) {
        this.fields = fields;
    }
}
