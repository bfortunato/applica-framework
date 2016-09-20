package applica.framework.library.responses;

public class ToolbarItem {

    private String icon;
    private String label;
    private String command;
    private String tooltip;

    public ToolbarItem() {
    }

    public ToolbarItem(String icon, String label, String command, String tooltip) {
        super();
        this.icon = icon;
        this.label = label;
        this.command = command;
        this.tooltip = tooltip;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getCommand() {
        return command;
    }

    public void setCommand(String command) {
        this.command = command;
    }

    public String getTooltip() {
        return tooltip;
    }

    public void setTooltip(String tooltip) {
        this.tooltip = tooltip;
    }
}
