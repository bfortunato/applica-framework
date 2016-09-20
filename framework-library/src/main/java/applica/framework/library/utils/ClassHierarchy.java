package applica.framework.library.utils;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 18/11/14
 * Time: 16:56
 */
public class ClassHierarchy {

    private Class superType;
    private List<ClassHierarchy> subTypes = new ArrayList<>();
    private ClassHierarchy parent;

    public ClassHierarchy(Class superType, List<ClassHierarchy> subTypes) {
        this.superType = superType;
        this.subTypes = subTypes;
    }

    public ClassHierarchy() {
    }

    public Class getSuperType() {
        return superType;
    }

    public void setSuperType(Class superType) {
        this.superType = superType;
    }

    public List<ClassHierarchy> getSubTypes() {
        return subTypes;
    }

    public void setSubTypes(List<ClassHierarchy> subTypes) {
        this.subTypes = subTypes;
    }

    @Override
    public String toString() {
        StringBuilder out = new StringBuilder();
        return toString(0);
    }

    public String toString(int level) {
        StringBuilder out  = new StringBuilder();
        for (int i = 0; i < level; i++) {
            out.append("\t");
        }
        if (level > 0) {
            out.append("|_ ");
        }
        out.append(String.format("%s\n", getSuperType().getName()));
        getSubTypes().forEach(s -> out.append(s.toString(level + 1)));
        return out.toString();
    }

    public void setParent(ClassHierarchy parent) {
        this.parent = parent;
    }

    public ClassHierarchy getParent() {
        return parent;
    }
}
