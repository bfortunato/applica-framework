package applica.framework.library.tests;

import applica.framework.library.utils.ObjectUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.MutablePropertyValues;
import org.springframework.beans.PropertyValue;
import org.springframework.beans.PropertyValues;
import org.springframework.web.bind.WebDataBinder;

import java.util.Map;

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

        Game game = ObjectUtils.bind(new Game(), values);

        Assert.assertEquals(3, game.getPlayers().size());

        PropertyValues flatten = ObjectUtils.flatten(game);

        for (PropertyValue p : flatten.getPropertyValues()) {
            System.out.println(p.toString() + " = " + p.getValue());
        }

        Assert.assertEquals(6, flatten.getPropertyValues().length);
    }

}
