package applica.framework.widgets;

import applica.framework.widgets.render.FormFieldRenderer;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class FormDescriptor {
    private Form form;
    private List<FormField> fields = new ArrayList<>();
    private List<FormButton> buttons = new ArrayList<>();

    public FormDescriptor(Form form) {
        super();
        this.form = form;

        if(form != null) {
            form.setDescriptor(this);
        }
    }

    public Form getForm() {
        return form;
    }

    public void setForm(Form form) {
        this.form = form;

        for (FormField field : getFields()) {
            field.setForm(form);
        }
    }

    public List<FormField> getFields() {
        return fields;
    }

    public void setFields(List<FormField> fields) {
        this.fields = fields;
    }

    public List<FormButton> getButtons() {
        return buttons;
    }

    public void setButtons(List<FormButton> buttons) {
        this.buttons = buttons;
    }

    public FormField addField(String property, Type dataType, String description, String fieldSet, FormFieldRenderer renderer) {
        FormField newField = new FormField(form, property, dataType, description, fieldSet, renderer);
        fields.add(newField);
        return newField;
    }

    public FormButton addButton(String label, String type, String action) {
        FormButton button = new FormButton(label, type, action);
        buttons.add(button);
        return button;
    }

    public List<FormField> getVisibleFields() {
        return getFields().stream().filter(f -> form.isFieldVisible(f.getProperty())).collect(Collectors.toList());
    }
}
