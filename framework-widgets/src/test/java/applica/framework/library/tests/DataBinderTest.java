package applica.framework.library.tests;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.MutablePropertyValues;
import org.springframework.web.bind.WebDataBinder;

/**
 * Created by bimbobruno on 03/02/2017.
 */
public class DataBinderTest {

    @Test
    public void testBinder() throws JsonProcessingException {
        MutablePropertyValues values = new MutablePropertyValues();
        values.add("name", "gta");
        values.add("brand.name", "rockstar");
        values.add("brandId", "210");
        values.add("players[0].name", "bruno");
        values.add("players[1].name", "massimo");
        values.add("players[2].name", "nicola");

        Game game = new Game();
        WebDataBinder dataBinder = new WebDataBinder(game);
        dataBinder.bind(values);


        Assert.assertEquals(3, game.getPlayers().size());

        ObjectMapper mapper = new ObjectMapper();
        System.out.println(mapper.writeValueAsString(game));
    }

}
