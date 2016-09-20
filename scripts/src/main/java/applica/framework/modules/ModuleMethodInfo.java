package applica.framework.modules;

import java.lang.reflect.Method;

/**
* Applica (www.applica.guru)
* User: bimbobruno
* Date: 01/10/14
* Time: 19:28
*/
public class ModuleMethodInfo {
    private String action;
    private Method method;
    private Object description;

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public Method getMethod() {
        return method;
    }

    public void setMethod(Method method) {
        this.method = method;
    }

    public Object getDescription() {
        return description;
    }

    public void setDescription(Object description) {
        this.description = description;
    }
}
