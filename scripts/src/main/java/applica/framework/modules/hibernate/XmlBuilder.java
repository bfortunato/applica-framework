package applica.framework.modules.hibernate;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 09/10/14
 * Time: 10:22
 */
public class XmlBuilder {
    protected int level = 0;
    protected StringBuilder xml = new StringBuilder();
    protected int baseLevel;

    protected Attr attr(String name, String value) {
        return new Attr(name, value);
    }

    protected void openClose(String tag, Attr... attributes) {
        levelize();
        xml.append(String.format("<%s", tag));
        writeAttributes(attributes);
        xml.append(" />");
    }

    protected void open(String tag, Attr... attributes) {
        levelize();
        xml.append(String.format("<%s", tag));
        writeAttributes(attributes);
        xml.append(">");
        level++;
    }

    protected void close(String tag) {
        level--;
        levelize();
        xml.append(String.format("</%s>", tag));
    }

    protected void closeNoIndent(String tag) {
        level--;
        xml.append(String.format("</%s>", tag));
    }

    protected void raw(String s) {
        levelize();
        xml.append(s);
    }

    protected void rawNoIndent(String s) {
        xml.append(s);
    }

    protected void levelize() {
        for (int i = 0; i < level + baseLevel; i++) {
            xml.append("\t");
        }
    }

    protected void writeAttributes(Attr... attributes) {
        StringBuilder attrs = new StringBuilder();
        int index = 0;
        if (attributes.length > 0) {
            xml.append(" ");

        }
        for (Attr attribute : attributes) {
            if (attribute == null) {
                continue;
            }
            index++;
            attrs.append(attribute.toString());
            if (index < attributes.length) {
                attrs.append(" ");
            }
        }

        xml.append(attrs.toString());
    }

    protected void endl() {
        xml.append("\n");
    }

    public void setBaseLevel(int baseLevel) {
        this.baseLevel = baseLevel;
    }

    public int getBaseLevel() {
        return baseLevel;
    }

    class Attr {
        private String name;
        private String value;

        Attr(String name, String value) {
            this.name = name;
            this.value = value;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getValue() {
            return value;
        }

        public void setValue(String value) {
            this.value = value;
        }

        @Override
        public String toString() {
            return String.format("%s=\"%s\"", name, value.replace("\"", "\\\""));
        }
    }
}
