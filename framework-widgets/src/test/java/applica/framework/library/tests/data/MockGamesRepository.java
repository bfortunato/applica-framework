package applica.framework.library.tests.data;

import applica.framework.library.tests.Brand;
import applica.framework.library.tests.Game;
import applica.framework.library.tests.Player;

import java.util.Arrays;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 31/10/14
 * Time: 12:43
 */
public class MockGamesRepository extends MockRepository<Game> {

    public MockGamesRepository() {
        save(
                new Game(
                        Game.GTA_ID,
                        "gta5",
                        new Brand(Brand.ROCKSTAR_ID, "rockstar"),
                        Brand.ROCKSTAR_ID,
                        Arrays.asList(
                                new Player(Player.BRUNO_ID, "bruno"),
                                new Player(Player.MASSIMO_ID, "massimo")
                        ),
                        Arrays.asList(
                                Player.BRUNO_ID,
                                Player.MASSIMO_ID
                        )
                )
        );
    }

    @Override
    public Class<Game> getEntityType() {
        return Game.class;
    }
}
