package applica.framework.library.tests;

import applica.framework.library.utils.TypeUtils;
import org.junit.Assert;

import java.lang.reflect.Field;

/**
 * Created by bimbobruno on 05/04/2017.
 */
public class RecursiveTypeFieldTest {

    //@Test
    public void testGetFieldRecursive() throws NoSuchFieldException {
        Field field = TypeUtils.getFieldRecursive(Game.class, "brand.name");
        Assert.assertEquals("name", field.getName());
    }

}
