import applica._APPNAME_.Application;
import applica._APPNAME_.domain.data.UsersRepository;
import applica._APPNAME_.domain.model.Filters;
import applica._APPNAME_.domain.model.User;
import applica._APPNAME_.services.AccountService;
import applica.framework.Query;
import applica.framework.library.responses.Response;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultHandler;
import org.springframework.web.context.WebApplicationContext;


import static org.hamcrest.CoreMatchers.is;
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

    @Autowired
    private AccountService accountService;

    @Autowired
    private UsersRepository usersRepository;

    @Before
    public void setup() {
        mvc = webAppContextSetup(webApplicationContext).build();
    }

    @Test
    public void loginTest() throws Exception {
        String mail = "test@applica.guru";

        //register new user
        mvc
                .perform(
                    post("/account/register")
                        .param("name", "Bruno Fortunato Test")
                        .param("mail", mail)
                        .param("password", "ciccio")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.responseCode", is(Response.OK)));


        //get user activation code
        User user = usersRepository.find(Query.build().eq(Filters.USER_MAIL, mail)).findFirst().orElse(null);
        Assert.assertFalse(user.isActive());
        Assert.assertNotNull(user);
        String activationCode = user.getActivationCode();

        mvc
                .perform(
                    post("/account/confirm")
                        .param("activationCode", activationCode)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.responseCode", is(Response.OK)));


        mvc
                .perform(
                    post("/auth/login")
                        .param("mail", "bimbobruno@gmail.com")
                        .param("password", "ciccio")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.responseCode", is(Response.OK)));


        accountService.destroy(user.getId());
    }

}
