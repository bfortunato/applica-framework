package applica.framework.library;

import java.util.ArrayList;
import java.util.List;

public class SimpleNodeItem {

    private String label;
    private String value;
    private List<SimpleNodeItem> nodes = new ArrayList<>();

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public List<SimpleNodeItem> getNodes() {
        return nodes;
    }

    public void setNodes(List<SimpleNodeItem> nodes) {
        this.nodes = nodes;
    }

    public SimpleNodeItem(String label, String value) {
        this(label, value, null);
    }

    public SimpleNodeItem(String label, String value, List<SimpleNodeItem> nodes) {
        this.label = label;
        this.value = value;
        this.nodes = nodes;
    }
}
