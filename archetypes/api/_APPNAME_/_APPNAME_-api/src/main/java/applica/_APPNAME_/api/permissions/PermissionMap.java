package applica._APPNAME_.api.permissions;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Created by antoniolovicario on 18/10/17.
 */
public class PermissionMap {
    //cliccare sul button nuova istanza dell'entità
    public static final String OPERATION_NEW = "new";
    //mostrare la griglia
    public static final String OPERATION_LIST = "list";
    //salvare le informazioni
    public static final String OPERATION_SAVE= "save";
    //mostrare il form
    public static final String OPERATION_EDIT = "edit";
    //eliminare una entity
    public static final String OPERATION_DELETE = "delete";

    //Genera la lista di tutte le permission relative ad una data entità
    public static final List<String> staticPermissions(String crudEntity){
        return new ArrayList<String>(Arrays.asList(crudEntity + String.format(":%s", OPERATION_NEW), crudEntity + String.format(":%s", OPERATION_LIST), crudEntity + String.format(":%s", OPERATION_SAVE), crudEntity + String.format(":%s", OPERATION_EDIT), crudEntity + String.format(":%s", OPERATION_DELETE)));
    }

    //Genera la lista di permission specifiche relative ad una data entità
    public static final List<String> getPartialPermissions(String crudEntity, List<String> operations) {

        List<String> permissions = new ArrayList<>();
        for (String operation: operations) {
            permissions.add(String.format("%s:%s", crudEntity, operation));
        }
        return permissions;

    }
}
