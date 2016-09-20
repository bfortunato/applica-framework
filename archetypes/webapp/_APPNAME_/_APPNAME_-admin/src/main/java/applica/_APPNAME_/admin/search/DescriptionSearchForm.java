package applica._APPNAME_.admin.search;

import applica.framework.widgets.annotations.Form;
import applica.framework.widgets.annotations.FormField;
import applica.framework.widgets.annotations.FormRenderer;
import applica.framework.Entity;
import applica.framework.widgets.forms.renderers.SearchFormRenderer;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 3/4/13
 * Time: 4:18 PM
 */
@Form(DescriptionSearchForm.EID)
@FormRenderer(SearchFormRenderer.class)
public class DescriptionSearchForm implements Entity {
    public static final String EID = "descriptionsearchform";

    private Object id;

    @FormField(description = "label.description")
    private String description;

    public Object getId() {
        return id;
    }

    public void setId(Object id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
