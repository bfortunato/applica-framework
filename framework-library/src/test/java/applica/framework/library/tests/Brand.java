package applica.framework.library.tests;

import applica.framework.SEntity;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 31/10/14
 * Time: 12:30
 */
public class Brand extends SEntity {

    public static final String ROCKSTAR_ID = "brand1";

    private String name;

    public Brand(String id, String name) {
        setId(id);
        this.name = name;
    }

    public Brand() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return name;
    }
}
