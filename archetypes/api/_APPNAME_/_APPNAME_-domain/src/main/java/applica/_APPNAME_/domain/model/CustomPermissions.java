package applica._APPNAME_.domain.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class CustomPermissions {

    public static final String EXEMPLE = "permission:void";

    public static List<String> getAll() {
        return new ArrayList<>(Arrays.asList(
                EXEMPLE
        ));
    }
}
