package applica.framework.widgets.entities;

import applica.framework.EntitiesScanner;
import applica.framework.Entity;
import applica.framework.security.authorization.Permissions;
import applica.framework.widgets.acl.CrudPermission;
import applica.framework.widgets.acl.CrudSecurityConfigurer;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class PermissionsRegistry implements EntitiesScanner.ScanHandler{

    private static PermissionsRegistry _instance;

    public static PermissionsRegistry instance() {
        if (_instance == null) {
            _instance = new PermissionsRegistry();
        }

        return _instance;
    }

    private Log logger = LogFactory.getLog(getClass());

    private PermissionsRegistry() {

    }

    @Override
    public void handle(Class<? extends Entity> entityType) {

        EntityId entityId = entityType.getAnnotation(EntityId.class);
        if (entityId != null) {
            String id = entityId.value();

            configurePermission(id, CrudPermission.NEW);
            configurePermission(id, CrudPermission.LIST);
            configurePermission(id, CrudPermission.SAVE);
            configurePermission(id, CrudPermission.EDIT);
            configurePermission(id, CrudPermission.DELETE);

            logger.info("Permissions configured for entity " + id);
        }
    }

    private void configurePermission(String entityId, String crudPermission) {
        String permission = String.format("%s:%s", entityId, crudPermission);
        Permissions.instance().registerStatic(permission);
        CrudSecurityConfigurer.instance().configure(entityId, crudPermission, permission);
    }
}
