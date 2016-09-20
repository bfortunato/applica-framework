package applica.framework.data.mongodb.tests;

import applica.framework.data.mongodb.constraints.ForeignKeyConstraint;
import applica.framework.data.mongodb.tests.model.Game;
import applica.framework.data.mongodb.tests.model.Player;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 31/10/14
 * Time: 12:34
 */
public class PlayersGameForeignKeyConstraint extends ForeignKeyConstraint<Player, Game> {

    @Override
    public Class<Player> getPrimaryType() {
        return Player.class;
    }

    @Override
    public Class<Game> getForeignType() {
        return Game.class;
    }

    @Override
    public String getForeignProperty() {
        return "players";
    }

}
