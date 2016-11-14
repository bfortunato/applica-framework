package applica._APPNAME_.admin.configuration;

import applica.framework.security.Security;
import applica.framework.security.UserService;
import applica.framework.security.authorization.AuthorizationService;
import applica.framework.security.authorization.BaseAuthorizationService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;

/**
 * Created by bimbobruno on 14/11/2016.
 */
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Bean
    public UserDetailsService userDetailsService() {
        return new UserService();
    }

    @Bean
    public AuthorizationService authorizationService() {
        return new BaseAuthorizationService();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        super.configure(http);
    }

}
