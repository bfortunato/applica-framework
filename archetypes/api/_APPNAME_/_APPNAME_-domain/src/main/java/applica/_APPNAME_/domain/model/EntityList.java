package applica._APPNAME_.domain.model;

/**
 * Created by antoniolovicario on 18/10/17.
 */
public class EntityList {


    // inserire i nomi di tutte le entità
    public static final String USER = "user";
    public static final String ROLE = "role";


    public static String [] getPermittedEntitiesByRole(String permission) {

        String [] permittedEntities;

        switch (permission) {

            case Role.ADMIN:
                permittedEntities = getAll();
                break;
            default:
                permittedEntities = new String[0];

        }

        return permittedEntities;

    }

    public static String[] getAll() {
        return new String[]{USER, ROLE};
    }
}
