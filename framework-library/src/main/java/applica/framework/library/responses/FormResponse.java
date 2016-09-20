package applica.framework.library.responses;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 2/28/13
 * Time: 8:16 PM
 */
public class FormResponse extends ContentResponse {
    private String title;
    private String action;
    private boolean ajax;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public boolean isAjax() {
        return ajax;
    }

    public void setAjax(boolean ajax) {
        this.ajax = ajax;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }
}
