package applica.framework.modules;

import java.util.List;

/**
* Applica (www.applica.guru)
* User: bimbobruno
* Date: 01/10/14
* Time: 19:27
*/
public class ModuleInfo {
    private String module;
    private List<ModuleMethodInfo> methods;
    private Class<? extends Module> type;

    public String getModule() {
        return module;
    }

    public void setModule(String module) {
        this.module = module;
    }

    public List<ModuleMethodInfo> getMethods() {
        return methods;
    }

    public void setMethods(List<ModuleMethodInfo> methods) {
        this.methods = methods;
    }

    public Class<? extends Module> getType() {
        return type;
    }

    public void setType(Class<? extends Module> type) {
        this.type = type;
    }
}
