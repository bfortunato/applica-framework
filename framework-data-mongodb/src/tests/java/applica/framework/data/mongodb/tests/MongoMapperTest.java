package applica.framework.data.mongodb.tests;

import applica.framework.data.mongodb.MongoMapper;
import applica.framework.data.mongodb.tests.data.MockBrandsRepository;
import applica.framework.data.mongodb.tests.data.MockGamesRepository;
import applica.framework.data.mongodb.tests.data.MockPlayersRepository;
import applica.framework.data.mongodb.tests.data.MockRepositoriesFactory;
import applica.framework.data.mongodb.tests.model.Brand;
import applica.framework.data.mongodb.tests.model.Game;
import applica.framework.data.mongodb.tests.model.Player;
import com.mongodb.BasicDBObject;
import junit.framework.Assert;
import org.junit.Test;

import java.util.List;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 01/11/14
 * Time: 10:55
 */
public class MongoMapperTest {

    @Test
    public void testRelations() {
        MockRepositoriesFactory mockRepositoriesFactory = new MockRepositoriesFactory();
        MockGamesRepository gamesRepository = (MockGamesRepository) mockRepositoriesFactory.createForEntity(Game.class);
        MockBrandsRepository brandsRepository = (MockBrandsRepository) mockRepositoriesFactory.createForEntity(Brand.class);
        MockPlayersRepository playersRepository = (MockPlayersRepository) mockRepositoriesFactory.createForEntity(Player.class);

        MongoMapper mongoMapper = new MongoMapper();
        mongoMapper.setRepositoriesFactory(mockRepositoriesFactory);

        Game gta = gamesRepository.get(Game.GTA_ID).get();
        Brand rockstar = brandsRepository.get(Brand.ROCKSTAR_ID).get();
        Player bruno = playersRepository.get(Player.BRUNO_ID).get();
        Player massimo = playersRepository.get(Player.MASSIMO_ID).get();

        BasicDBObject serialized = mongoMapper.loadBasicDBObject(gta);
        Assert.assertNotNull(serialized);

        List<?> players = ((List<?>) serialized.get("players"));
        List<?> oneToManyPlayers = ((List<?>) serialized.get("oneToManyPlayers"));
        List<?> manyToManyPlayers = ((List<?>) serialized.get("manyToManyPlayers"));

        Assert.assertNotNull(players);
        Assert.assertNotNull(oneToManyPlayers);
        Assert.assertNotNull(manyToManyPlayers);
        Assert.assertEquals(playersRepository.find(null).getTotalRows(), players.size());
        Assert.assertEquals(playersRepository.find(null).getTotalRows(), oneToManyPlayers.size());
        Assert.assertEquals(playersRepository.find(null).getTotalRows(), manyToManyPlayers.size());
        Assert.assertTrue("Not a list of entity", BasicDBObject.class.isAssignableFrom(players.get(0).getClass()));
        Assert.assertTrue("Not a list of entity", BasicDBObject.class.isAssignableFrom(players.get(1).getClass()));
        Assert.assertEquals(Player.BRUNO_ID, ((BasicDBObject) players.get(0)).getString("_id"));
        Assert.assertEquals(Player.MASSIMO_ID, ((BasicDBObject) players.get(1)).getString("_id"));
        Assert.assertEquals(Player.BRUNO_ID, oneToManyPlayers.get(0).toString());
        Assert.assertEquals(Player.MASSIMO_ID, oneToManyPlayers.get(1).toString());
        Assert.assertEquals(Player.BRUNO_ID, manyToManyPlayers.get(0).toString());
        Assert.assertEquals(Player.MASSIMO_ID, manyToManyPlayers.get(1).toString());

        Assert.assertEquals(Brand.ROCKSTAR_ID, serialized.get("manyToOneBrand").toString());

        Game deserialized = ((Game) mongoMapper.loadObject(serialized, Game.class));
        Assert.assertNotNull(deserialized);
        Assert.assertNotNull(deserialized.getPlayers());
        Assert.assertNotNull(deserialized.getOneToManyPlayers());
        Assert.assertNotNull(deserialized.getManyToManyPlayers());
        Assert.assertEquals(playersRepository.find(null).getTotalRows(), deserialized.getPlayers().size());
        Assert.assertEquals(playersRepository.find(null).getTotalRows(), deserialized.getOneToManyPlayers().size());
        Assert.assertEquals(playersRepository.find(null).getTotalRows(), deserialized.getManyToManyPlayers().size());
        Assert.assertEquals(Player.BRUNO_ID, deserialized.getPlayers().get(0).getSid());
        Assert.assertEquals(Player.MASSIMO_ID, deserialized.getPlayers().get(1).getSid());
        Assert.assertEquals(Player.BRUNO_ID, deserialized.getOneToManyPlayers().get(0).getSid());
        Assert.assertEquals(Player.MASSIMO_ID, deserialized.getOneToManyPlayers().get(1).getSid());
        Assert.assertEquals(Player.BRUNO_ID, deserialized.getManyToManyPlayers().get(0).getSid());
        Assert.assertEquals(Player.MASSIMO_ID, deserialized.getManyToManyPlayers().get(1).getSid());

        Assert.assertNotNull(deserialized.getManyToOneBrand());
        Assert.assertEquals(Brand.ROCKSTAR_ID, deserialized.getManyToOneBrand().getSid());

        System.out.println(serialized.toString());
    }

}
