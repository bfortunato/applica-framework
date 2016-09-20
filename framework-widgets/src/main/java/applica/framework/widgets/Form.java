package applica.framework.widgets;

import applica.framework.library.utils.ParametrizedObject;
import applica.framework.widgets.acl.Visibility;
import applica.framework.widgets.fields.Params;
import applica.framework.widgets.render.FormRenderer;
import org.apache.commons.lang3.StringUtils;

import java.io.StringWriter;
import java.io.Writer;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class Form extends ParametrizedObject {
    private String identifier;
    private String title;
    private FormDescriptor descriptor;
    private FormRenderer renderer;
    private boolean editMode = false;
    private String method = "POST";
    private String action = "javascript:;";
    private Visibility visibility;
    private Map<String, Object> data;
    private List<FieldSet> fieldSets;

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public Map<String, Object> getData() {
        return data;
    }

    public void setData(Map<String, Object> data) {
        this.data = data;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public FormDescriptor getDescriptor() {
        return descriptor;
    }

    public void setDescriptor(FormDescriptor descriptor) {
        this.descriptor = descriptor;

        //adjust references
        if (descriptor != null) {
            descriptor.setForm(this);
        }
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public FormRenderer getRenderer() {
        return renderer;
    }

    public void setRenderer(FormRenderer renderer) {
        this.renderer = renderer;
    }

    public void setEditMode(boolean editMode) {
        this.editMode = editMode;
    }

    public boolean isEditMode() {
        return editMode;
    }

    public List<FieldSet> getFieldSets() {
        if (fieldSets == null) {
            fieldSets = new ArrayList<>();

            FieldSet defaultFieldSet = new FieldSet(this);
            defaultFieldSet.setName(FieldSet.DEFAULT);
            defaultFieldSet.setFields(
                    descriptor.getFields().stream().filter(f -> StringUtils.isEmpty(f.getFieldSet()) || FieldSet.DEFAULT.equals(f.getFieldSet())).collect(Collectors.toList())
            );
            fieldSets.add(defaultFieldSet);

            descriptor.getFields()
                    .stream()
                    .filter(f -> StringUtils.isNotEmpty(f.getFieldSet()))
                    .filter(f -> !FieldSet.DEFAULT.equals(f.getFieldSet()))
                    .map(FormField::getFieldSet)
                    .distinct()
                    .forEach(fs -> {
                        FieldSet fieldSet = new FieldSet(this);
                        fieldSet.setName(fs);
                        fieldSet.setFields(
                                descriptor.getFields().stream().filter(f -> fs.equals(f.getFieldSet())).collect(Collectors.toList())
                        );
                        fieldSets.add(fieldSet);
                    });

        }

        return fieldSets;
    }

    public List<FieldSet> getVisibleFieldSets() {
        List<FieldSet> fieldSets = getFieldSets().stream()
                .peek(fs -> fs.setFields(fs.getFields().stream().filter(f -> isFieldVisible(f.getProperty())).collect(Collectors.toList())))
                .filter(fs -> fs.getFields().size() > 0)
                .collect(Collectors.toList());

        return fieldSets;
    }


    public List<FieldSet> getFieldSetsForCol(String colName) {

            fieldSets = new ArrayList<>();

            FieldSet defaultFieldSet = new FieldSet(this);
            defaultFieldSet.setName(FieldSet.DEFAULT);
            defaultFieldSet.setFields(
                    descriptor.getFields().stream().filter(f -> {
                            return contrainsColumn(f, colName) && (StringUtils.isEmpty(f.getFieldSet())
                                    ||
                                    FieldSet.DEFAULT.equals(f.getFieldSet()));
                    }).collect(Collectors.toList())
            );
            fieldSets.add(defaultFieldSet);

            descriptor.getFields()
                    .stream()
                    .filter(f -> contrainsColumn(f, colName))
                    .filter(f -> StringUtils.isNotEmpty(f.getFieldSet()))
                    .filter(f -> !FieldSet.DEFAULT.equals(f.getFieldSet()))
                    .map(FormField::getFieldSet)
                    .distinct()
                    .forEach(fs -> {
                        FieldSet fieldSet = new FieldSet(this);
                        fieldSet.setName(fs);
                        fieldSet.setFields(
                                descriptor.getFields().stream().filter(f -> fs.equals(f.getFieldSet())).collect(Collectors.toList())
                        );
                        fieldSets.add(fieldSet);
                    });



        return fieldSets;
    }

    private boolean contrainsColumn(FormField f, String colName) {
        String col = f.getParam(Params.FORM_COLUMN);
        if (col != null)
            if (col.equals(colName))
                return true;

        return false;
    }


    public List<FieldSet> visibleFieldSetsForCol(String colName) {
        List<FieldSet> fieldSets = getFieldSetsForCol(colName).stream()
                .peek(fs -> fs.setFields(fs.getFields().stream().filter(f -> isFieldVisible(f.getProperty())).collect(Collectors.toList())))
                .filter(fs -> fs.getFields().size() > 0)
                .collect(Collectors.toList());

        return fieldSets;
    }

    public FieldSet getFieldSet(String name) {
        List<FieldSet> fieldSets = getFieldSets();

        return fieldSets.stream().filter((f) -> f.getName().equals(name)).findFirst().orElseThrow(() -> new RuntimeException("Fieldset " + name + " not found"));
    }

    public String writeToString() throws FormCreationException, CrudConfigurationException {
        StringWriter writer = new StringWriter();
        write(writer);

        return writer.toString();
    }

    public void write(Writer writer) throws FormCreationException, CrudConfigurationException {
        if (descriptor == null) throw new FormCreationException("Missing descriptor");
        if (renderer == null) throw new FormCreationException("Missing renderer");

        renderer.render(writer, this, data);
    }

    public Visibility getVisibility() {
        return visibility;
    }

    public void setVisibility(Visibility visibility) {
        this.visibility = visibility;
    }

    public boolean isFieldVisible(String property) {
        if (visibility == null) { return true; }
        else return (visibility.isFieldVisible(this, property));
    }
}
