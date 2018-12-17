package applica.framework.library.tests;

import applica.framework.Query;
import applica.framework.library.utils.ObjectUtils;
import applica.framework.library.utils.QueryString;
import org.junit.Assert;

/**
 * Created by bimbobruno on 03/02/2017.
 */
public class QueryStringTest {

   //@Test
    public void queryStringText() {
        Query query = Query.build().eq("name", "bruno");
        query.setKeyword("keyword");

        String expected = "page=0&rowsPerPage=0&keyword=keyword&filters[0].property=name&filters[0].value=bruno&filters[0].type=eq";
        String actual = QueryString.build(ObjectUtils.flatten(query));

        Assert.assertEquals(expected, actual);
    }

}
