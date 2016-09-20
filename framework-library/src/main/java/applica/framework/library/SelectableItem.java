package applica.framework.library;

import applica.framework.library.utils.Func;
import org.apache.commons.beanutils.PropertyUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 3/20/13
 * Time: 12:45 PM
 */
public class SelectableItem extends SimpleItem {
    private boolean selected;

    public SelectableItem() { }

    public SelectableItem(String label, String value, boolean selected) {
        super(label, value);
        this.selected = selected;
    }

    public boolean isSelected() {
        return selected;
    }

    public void setSelected(boolean selected) {
        this.selected = selected;
    }

    public static <T> List<SelectableItem> createList(List<T> objects, Func<T, String> labelFunc, Func<T, String> valueFunc, Func<T, Boolean> selectedFunc) {
        List<SelectableItem> items = new ArrayList<SelectableItem>();
        for (T obj : objects) {
            items.add(new SelectableItem(labelFunc.eval(obj), valueFunc.eval(obj), selectedFunc.eval(obj)));
        }
        return items;
    }

    public static List<SelectableItem> createList(List<?> objects, String labelProperty, String valueProperty, String selectedProperty) {
        List<SelectableItem> items = new ArrayList<SelectableItem>();
        for (Object obj : objects) {
            try {
                Object label = PropertyUtils.getSimpleProperty(obj, labelProperty);
                Object value = PropertyUtils.getSimpleProperty(obj, valueProperty);
                Object selected = PropertyUtils.getSimpleProperty(obj, valueProperty);
                if(selected == null) {
                    selected = "false";
                }
                String slabel = label != null ? label.toString() : "";
                String svalue = value != null ? value.toString() : "";
                Boolean bselected = Boolean.parseBoolean(selected.toString());
                items.add(new SelectableItem(slabel, svalue, bselected));
            } catch (Exception e) {
                e.printStackTrace();
            }

        }
        return items;
    }
}
