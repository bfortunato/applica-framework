package applica.framework.data.mongodb.tests.data;

import applica.framework.data.mongodb.tests.model.Brand;
import applica.framework.data.mongodb.tests.model.Player;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 31/10/14
 * Time: 12:43
 */
public class MockPlayersRepository extends MockRepository<Player> {

    public MockPlayersRepository() {
        save(new Player(Player.BRUNO_ID, "bruno"));
        save(new Player(Player.MASSIMO_ID, "massimo"));
    }

    @Override
    public Class<Player> getEntityType() {
        return Player.class;
    }
}
