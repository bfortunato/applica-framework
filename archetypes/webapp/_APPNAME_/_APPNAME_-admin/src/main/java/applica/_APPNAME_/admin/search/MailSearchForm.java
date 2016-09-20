package applica._APPNAME_.admin.search;

import applica.framework.widgets.annotations.Form;
import applica.framework.widgets.annotations.FormField;
import applica.framework.widgets.annotations.FormRenderer;
import applica.framework.widgets.annotations.SearchCriteria;
import applica.framework.Entity;
import applica.framework.Filter;
import applica.framework.widgets.forms.renderers.SearchFormRenderer;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 3/4/13
 * Time: 4:18 PM
 */
@Form(MailSearchForm.EID)
@FormRenderer(SearchFormRenderer.class)
public class MailSearchForm implements Entity {
    public static final String EID = "mailsearchform";

    private Object id;

    @FormField(description = "label.mail")
    @SearchCriteria(Filter.LIKE)
    private String mail;

    public Object getId() {
        return id;
    }

    public void setId(Object id) {
        this.id = id;
    }

    public String getMail() {
        return mail;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }
}
