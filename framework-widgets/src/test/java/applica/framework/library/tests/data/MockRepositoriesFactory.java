package applica.framework.library.tests.data;

import applica.framework.Entity;
import applica.framework.RepositoriesFactory;
import applica.framework.Repository;
import applica.framework.library.tests.Brand;
import applica.framework.library.tests.Game;
import applica.framework.library.tests.Player;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 31/10/14
 * Time: 12:41
 */
public class MockRepositoriesFactory implements RepositoriesFactory {
    @Override
    public Repository createForEntity(Class<? extends Entity> type) {
        if (type.equals(Game.class)) {
            return new MockGamesRepository();
        } else if (type.equals(Player.class)) {
            return new MockPlayersRepository();
        } else if (type.equals(Brand.class)) {
            return new MockBrandsRepository();
        }

        throw new RuntimeException("not implemented");
    }

    @Override
    public Repository create(Class<? extends Repository> type) {
        throw new RuntimeException("not implemented");
    }
}
