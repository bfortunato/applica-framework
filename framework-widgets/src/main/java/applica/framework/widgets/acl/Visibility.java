package applica.framework.widgets.acl;

import applica.framework.widgets.Form;
import applica.framework.widgets.Grid;

/**
 * Created by bimbobruno on 15/09/15.
 */
public interface Visibility {

    boolean isColumnVisible(Grid grid, String property);
    boolean isFieldVisible(Form form, String property);

}
