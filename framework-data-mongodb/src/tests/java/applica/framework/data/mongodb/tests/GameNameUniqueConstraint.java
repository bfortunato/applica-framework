package applica.framework.data.mongodb.tests;

import applica.framework.data.mongodb.constraints.UniqueConstraint;
import applica.framework.data.mongodb.tests.model.Game;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 31/10/14
 * Time: 12:33
 */
public class GameNameUniqueConstraint extends UniqueConstraint<Game> {

    @Override
    public Class<Game> getType() {
        return Game.class;
    }

    @Override
    public String getProperty() {
        return "name";
    }

}
