import applica._APPNAME_.admin.Application;
import applica._APPNAME_.admin.responses.LoginResponse;
import applica.framework.library.responses.Response;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;



/**
 * Created by bimbobruno on 14/11/2016.
 */

@RunWith(SpringRunner.class)
@SpringBootTest(classes = { Application.class, TestConfiguration.class })
public class AuthTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    public void loginTest() {
        MultiValueMap<String, Object> map = new LinkedMultiValueMap<>();
        map.add("mail", "bimbobruno@gmail.com");
        map.add("password", "ciccio");

        LoginResponse loginResponse = restTemplate.postForObject("/auth/login", map, LoginResponse.class);

        Assert.assertEquals(Response.OK, loginResponse.getResponseCode());
    }

}
