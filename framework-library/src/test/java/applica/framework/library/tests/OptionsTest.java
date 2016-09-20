package applica.framework.library.tests;

import applica.framework.library.options.PropertiesOptionManager;
import org.junit.Assert;

import java.util.Properties;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 29/10/14
 * Time: 17:57
 */
public class OptionsTest {

    @org.junit.Test
    public void options() {
        PropertiesOptionManager options = new PropertiesOptionManager();
        Properties properties = new Properties();

        properties.put("environment", "test");

        properties.put("user.name_with_strange_chars&numbers123", "bruno");
        properties.put("fullName", "${name} ${surname}");
        properties.put("name", "${user.name_with_strange_chars&numbers123}");
        properties.put("surname", "fortunato");
        properties.put("test.surname", "tested");

        options.load(properties);

        Assert.assertEquals("bruno", options.get("name"));
        Assert.assertEquals("tested", options.get("surname"));
        Assert.assertEquals("bruno tested", options.get("fullName"));

        properties.setProperty("environment", "");

        Assert.assertEquals("bruno", options.get("name"));
        Assert.assertEquals("fortunato", options.get("surname"));
        Assert.assertEquals("bruno fortunato", options.get("fullName"));
        Assert.assertEquals("bruno", options.getFromCache("test.name"));
    }

}
