package applica.framework.widgets.acl;

import java.util.ArrayList;
import java.util.List;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 03/02/14
 * Time: 15:33
 */
public class CrudSecurityConfigurer {

    private CrudSecurityConfigurer() {}

    private static CrudSecurityConfigurer _instance;

    public static CrudSecurityConfigurer instance() {
        if(_instance == null) {
            _instance = new CrudSecurityConfigurer();
        }

        return _instance;
    }

    private List<CrudSecurityConfigurationItem> items = new ArrayList<>();

    public void configure(String entity, String crudPermission, String expression) {
        CrudSecurityConfigurationItem item = getItemByEntity(entity);
        if(item == null) {
            item = new CrudSecurityConfigurationItem(entity);
            items.add(item);
        }

        item.addExpression(crudPermission, expression);
    }

    private CrudSecurityConfigurationItem getItemByEntity(String entity) {
        for(CrudSecurityConfigurationItem item : items) {
            if(item.getEntity().equals(entity)) {
                return item;
            }
        }

        return null;
    }

    public String getExpression(String entity, String crudPermission) {
        CrudSecurityConfigurationItem item = getItemByEntity(entity);
        if(item != null) {
            return item.getExpression(crudPermission);
        }

        return null;
    }
}
