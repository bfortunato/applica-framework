package applica.framework.revision.model.settings;

import applica.framework.AEntity;

import java.util.ArrayList;
import java.util.List;

public abstract class Settings extends AEntity {

    private String type;
    private List<SettingItem> items = new ArrayList<>();


    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<SettingItem> getItems() {
        return items;
    }

    public void setItems(List<SettingItem> items) {
        this.items = items;
    }

    public boolean isEnabled(String itemType) {
        SettingItem item = items != null? items.stream().filter(i -> i.getItemType().equals(itemType)).findFirst().orElse(null)  : null;
        return item != null && item.isEnabled();
    }
}
