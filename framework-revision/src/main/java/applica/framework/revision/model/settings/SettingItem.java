package applica.framework.revision.model.settings;

import applica.framework.AEntity;
public class SettingItem extends AEntity {
    private String itemType;
    private boolean enabled;

    public SettingItem() {}

    public SettingItem(String type) {
        this.itemType = type;
    }

    public SettingItem(String type, SettingItem previousSetting) {
        this(type);
        this.enabled = previousSetting != null && previousSetting.isEnabled();
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getItemType() {
        return itemType;
    }

    public void setItemType(String itemType) {
        this.itemType = itemType;
    }
}
