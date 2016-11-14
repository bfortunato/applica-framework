import applica._APPNAME_.admin.Application;
import applica._APPNAME_.admin.responses.LoginResponse;
import applica.framework.library.responses.Response;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.context.WebApplicationContext;


import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.*;


/**
 * Created by bimbobruno on 14/11/2016.
 */

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = { Application.class })
@WebAppConfiguration
public class AuthTest {

    private MockMvc mvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Before
    public void setup() {
        mvc = webAppContextSetup(webApplicationContext).build();
    }

    @Test
    public void loginTest() throws Exception {
        mvc
                .perform(
                    post("/auth/login")
                            .param("mail", "bimbobruno@gmail.com")
                            .param("password", "ciccio")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.responseCode", is(Response.OK)));

    }

}
