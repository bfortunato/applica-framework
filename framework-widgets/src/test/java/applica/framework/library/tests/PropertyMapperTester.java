package applica.framework.library.tests;

import applica.framework.RepositoriesFactory;
import applica.framework.library.tests.data.MockRepositoriesFactory;
import applica.framework.widgets.mapping.MappingException;
import applica.framework.widgets.mapping.SimplePropertyMapper;
import org.junit.Assert;
import org.junit.Test;

import java.util.HashMap;
import java.util.List;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 03/11/14
 * Time: 11:05
 */
public class PropertyMapperTester {

    @Test
    public void testMapping() {
        RepositoriesFactory repositoriesFactory = new MockRepositoriesFactory();

        SimplePropertyMapper propertyMapper = new SimplePropertyMapper();
        propertyMapper.setRepositoriesFactory(repositoriesFactory);

        Game game = new Game();
        HashMap<String, String[]> values = new HashMap<>();
        values.put("name", new String[] { "gta5" });
        values.put("brand", new String[] { Brand.ROCKSTAR_ID });
        values.put("players", new String[] {Player.BRUNO_ID, Player.MASSIMO_ID });
        values.put("manyToManyPlayers", new String[] {Player.BRUNO_ID, Player.MASSIMO_ID });
        try {
            propertyMapper.toEntityProperty("name", game, values);
            propertyMapper.toEntityProperty("brand", game, values);
            propertyMapper.toEntityProperty("players", game, values);
            propertyMapper.toEntityProperty("manyToManyPlayers", game, values);
        } catch (MappingException e) {
            e.printStackTrace();
            Assert.assertTrue(e.getMessage(), false);
        }

        Assert.assertEquals("gta5", game.getName());
        Assert.assertNotNull(game.getBrand());
        Assert.assertEquals(Brand.ROCKSTAR_ID, game.getBrand().getSid());
        Assert.assertEquals("rockstar", game.getBrand().getName());
        Assert.assertEquals(repositoriesFactory.createForEntity(Player.class).find(null).getTotalRows(), game.getPlayers().size());
        Assert.assertEquals(repositoriesFactory.createForEntity(Player.class).find(null).getTotalRows(), game.getManyToManyPlayers().size());
        Assert.assertEquals(Player.BRUNO_ID, game.getPlayers().get(0).getSid());
        Assert.assertEquals(Player.MASSIMO_ID, game.getPlayers().get(1).getSid());

        HashMap<String, Object> formValues = new HashMap<>();
        try {
            propertyMapper.toFormValue("name", formValues, game);
            propertyMapper.toFormValue("brand", formValues, game);
            propertyMapper.toFormValue("players", formValues, game);
            propertyMapper.toFormValue("manyToManyPlayers", formValues, game);
        } catch (MappingException e) {
            e.printStackTrace();
            Assert.assertTrue(e.getMessage(), false);
        }

        Assert.assertTrue(formValues.containsKey("name"));
        Assert.assertTrue(formValues.containsKey("brand"));
        Assert.assertTrue(formValues.containsKey("players"));
        Assert.assertTrue(formValues.containsKey("manyToManyPlayers"));
        Assert.assertEquals("gta5", formValues.get("name"));
        Assert.assertEquals(Brand.ROCKSTAR_ID, ((Brand) formValues.get("brand")).getSid());
        Assert.assertEquals(Player.BRUNO_ID, ((List<Player>) formValues.get("players")).get(0).getSid());
        Assert.assertEquals(Player.MASSIMO_ID, ((List<Player>) formValues.get("manyToManyPlayers")).get(1).getSid());

        try {
            System.out.println(formValues.toString());
        } catch (Exception e) {
            e.printStackTrace();
            Assert.assertTrue(e.getMessage(), false);
        }
    }

}
