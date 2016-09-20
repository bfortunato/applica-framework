package applica.framework.widgets.acl;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 03/02/14
 * Time: 15:24
 */
public interface CrudGuard {

    void check(String crudPermission, String entity) throws CrudAuthorizationException;

}
