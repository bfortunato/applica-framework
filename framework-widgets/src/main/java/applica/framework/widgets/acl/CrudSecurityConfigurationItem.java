package applica.framework.widgets.acl;

import java.util.HashMap;
import java.util.Map;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 03/02/14
 * Time: 15:34
 */
public class CrudSecurityConfigurationItem {

    private String entity;
    private Map<String, String> expressions = new HashMap<>();

    public String getEntity() {
        return entity;
    }

    public void setEntity(String entity) {
        this.entity = entity;
    }

    public Map<String, String> getExpressions() {
        return expressions;
    }

    public void setExpressions(Map<String, String> expressions) {
        this.expressions = expressions;
    }

    public CrudSecurityConfigurationItem(String entity) {
        this.entity = entity;
    }

    public void addExpression(String crudPermission, String aclExpression) {
        expressions.put(crudPermission, aclExpression);
    }

    public String getExpression(String crudPermission) {
        if(expressions.containsKey(crudPermission)) {
            return expressions.get(crudPermission);
        }

        return null;
    }
}
