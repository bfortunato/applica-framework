package applica.framework.data.mongodb.tests;

import applica.framework.data.mongodb.constraints.ForeignKeyConstraint;
import applica.framework.data.mongodb.tests.model.Brand;
import applica.framework.data.mongodb.tests.model.Game;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 31/10/14
 * Time: 12:34
 */
public class BrandGameForeignKeyConstraint extends ForeignKeyConstraint<Brand, Game> {

    @Override
    public Class<Brand> getPrimaryType() {
        return Brand.class;
    }

    @Override
    public Class<Game> getForeignType() {
        return Game.class;
    }

    @Override
    public String getForeignProperty() {
        return "brand";
    }

}
