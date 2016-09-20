package applica.framework.data.mongodb.tests;

import applica.framework.Entity;
import applica.framework.data.mongodb.constraints.ConstraintException;
import applica.framework.data.mongodb.constraints.ReferencedConstraint;
import applica.framework.data.mongodb.tests.data.MockBrandsRepository;
import applica.framework.data.mongodb.tests.data.MockGamesRepository;
import applica.framework.data.mongodb.tests.data.MockPlayersRepository;
import applica.framework.data.mongodb.tests.data.MockRepositoriesFactory;
import applica.framework.data.mongodb.tests.model.Brand;
import applica.framework.data.mongodb.tests.model.Game;
import applica.framework.data.mongodb.tests.model.Player;
import junit.framework.Assert;

import java.util.Arrays;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 31/10/14
 * Time: 12:29
 */
public class ConstraintsTest {

    @org.junit.Test
    public void testUnique() {
        MockRepositoriesFactory mockRepositoriesFactory = new MockRepositoriesFactory();
        MockGamesRepository gamesRepository = (MockGamesRepository) mockRepositoriesFactory.createForEntity(Game.class);
        MockBrandsRepository brandsRepository = (MockBrandsRepository) mockRepositoriesFactory.createForEntity(Brand.class);
        MockPlayersRepository playersRepository = (MockPlayersRepository) mockRepositoriesFactory.createForEntity(Player.class);


        GameNameUniqueConstraint uniqueConstraint = new GameNameUniqueConstraint();
        uniqueConstraint.setRepositoriesFactory(mockRepositoriesFactory);
        Game invalidGame = new Game(
                "non_existent_id",
                "gta5",
                brandsRepository.get(Brand.ROCKSTAR_ID).get(),
                Brand.ROCKSTAR_ID,
                playersRepository.find(null).getRows(),
                Arrays.asList(
                        Player.BRUNO_ID,
                        Player.MASSIMO_ID
                )
        );

        Game validGame = new Game(
                "game_test",
                "not_existent_name",
                new Brand("brand1", "rockstar"),
                "brand1",
                Arrays.asList(
                        new Player("player1", "bruno"),
                        new Player("player2", "massimo")
                ),
                Arrays.asList(
                        "player1",
                        "player2"
                )
        );

        Exception exception = null;
        try {
            uniqueConstraint.check(invalidGame);
        } catch (ConstraintException e) {
            exception = e;
            System.out.println("Test OK: " + e.getMessage());
        }

        try {
            uniqueConstraint.check(validGame);
        } catch (ConstraintException e) {
            Assert.assertTrue("Expected to be valid, but is invalid: " + e.getMessage(), false);
        }

        Assert.assertNotNull("expected ConstraintException", exception);
        Assert.assertTrue(ConstraintException.class.isAssignableFrom(exception.getClass()));
    }

    @org.junit.Test
    public void testForeign() {
        MockRepositoriesFactory mockRepositoriesFactory = new MockRepositoriesFactory();
        MockGamesRepository gamesRepository = (MockGamesRepository) mockRepositoriesFactory.createForEntity(Game.class);
        MockBrandsRepository brandsRepository = (MockBrandsRepository) mockRepositoriesFactory.createForEntity(Brand.class);
        MockPlayersRepository playersRepository = (MockPlayersRepository) mockRepositoriesFactory.createForEntity(Player.class);

        BrandGameForeignKeyConstraint brandGameForeignKeyConstraint = new BrandGameForeignKeyConstraint();
        BrandIdGameForeignKeyConstraint brandIdGameForeignKeyConstraint = new BrandIdGameForeignKeyConstraint();
        PlayersGameForeignKeyConstraint playersGameForeignKeyConstraint = new PlayersGameForeignKeyConstraint();
        PlayerIdsGameForeignKeyConstraint playerIdsGameForeignKeyConstraint = new PlayerIdsGameForeignKeyConstraint();
        brandGameForeignKeyConstraint.setRepositoriesFactory(mockRepositoriesFactory);
        brandIdGameForeignKeyConstraint.setRepositoriesFactory(mockRepositoriesFactory);
        playersGameForeignKeyConstraint.setRepositoriesFactory(mockRepositoriesFactory);
        playerIdsGameForeignKeyConstraint.setRepositoriesFactory(mockRepositoriesFactory);

        Brand rockstar = brandsRepository.get(Brand.ROCKSTAR_ID).get();
        Brand invalidBrand = new Brand("invalid_brand", "invalid brand");
        Player bruno = playersRepository.get(Player.BRUNO_ID).get();
        Player massimo = playersRepository.get(Player.MASSIMO_ID).get();
        Player invalidPlayer = new Player("invalid_player", "invalid player");

        Game invalidGame = new Game(
                "game_test",
                "gta5",
                invalidBrand,
                invalidBrand.getSid(),
                Arrays.asList(bruno, massimo, invalidPlayer),
                Arrays.asList(bruno.getSid(), massimo.getSid(), invalidPlayer.getSid())
        );

        Game validGame = gamesRepository.get(Game.GTA_ID).get();

        int valid = 0;
        valid += checkForeignQuietly(brandGameForeignKeyConstraint, invalidGame);
        valid += checkPrimaryQuietly(brandGameForeignKeyConstraint, rockstar);
        valid += checkForeignQuietly(brandIdGameForeignKeyConstraint, invalidGame);
        valid += checkPrimaryQuietly(brandIdGameForeignKeyConstraint, rockstar);
        valid += checkForeignQuietly(playersGameForeignKeyConstraint, invalidGame);
        valid += checkPrimaryQuietly(playersGameForeignKeyConstraint, bruno);
        valid += checkPrimaryQuietly(playersGameForeignKeyConstraint, massimo);
        valid += checkForeignQuietly(playerIdsGameForeignKeyConstraint, invalidGame);
        valid += checkPrimaryQuietly(playerIdsGameForeignKeyConstraint, bruno);
        valid += checkPrimaryQuietly(playerIdsGameForeignKeyConstraint, massimo);
        Assert.assertTrue("All conditions before must be invalid but someone is valid", valid == 0);

        try {
            brandGameForeignKeyConstraint.checkForeign(validGame);
            brandGameForeignKeyConstraint.checkPrimary(invalidBrand);
            brandIdGameForeignKeyConstraint.checkForeign(validGame);
            brandIdGameForeignKeyConstraint.checkPrimary(invalidBrand);
            playersGameForeignKeyConstraint.checkForeign(validGame);
            playersGameForeignKeyConstraint.checkPrimary(invalidPlayer);
            playerIdsGameForeignKeyConstraint.checkForeign(validGame);
            playerIdsGameForeignKeyConstraint.checkPrimary(invalidPlayer);
        } catch (ConstraintException e) {
            Assert.assertTrue("Expected to be valid, but is invalid: " + e.getMessage(), false);
        }

    }


    private int checkPrimaryQuietly(ReferencedConstraint constraint, Entity entity) {
        try {
            constraint.checkPrimary(entity);
            System.out.println(String.format("Test ERROR: Primary check valid: %s [%s]", constraint.getClass().getName(), entity.getId()));
            return 1;
        } catch (ConstraintException e) {
            System.out.println("Test OK: " + e.getMessage());
            return 0;
        }
    }

    private int checkForeignQuietly(ReferencedConstraint constraint, Entity entity) {
        try {
            constraint.checkForeign(entity);
            System.out.println(String.format("Test ERROR: Foreign check valid: %s [%s]", constraint.getClass().getName(), entity.getId()));
            return 1;
        } catch (ConstraintException e) {
            System.out.println("Test OK: " + e.getMessage());
            return 0;
        }
    }

}
