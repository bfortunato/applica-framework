package applica._APPNAME_.admin.search;

import applica.framework.widgets.annotations.Form;
import applica.framework.widgets.annotations.FormField;
import applica.framework.widgets.annotations.FormRenderer;
import applica.framework.widgets.annotations.SearchCriteria;
import applica.framework.Filter;
import applica.framework.SEntity;
import applica.framework.widgets.forms.renderers.SearchFormRenderer;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 3/4/13
 * Time: 4:18 PM
 */
@Form(RoleSearchForm.EID)
@FormRenderer(SearchFormRenderer.class)
public class RoleSearchForm extends SEntity {
    public static final String EID = "rolesearchform";

    @FormField(description = "label.name")
    @SearchCriteria(Filter.LIKE)
    private String role;

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
