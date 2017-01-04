package applica._APPNAME_.api.configuration;

import applica.framework.security.Security;
import applica.framework.security.UserDetailsRepository;
import applica.framework.security.UserService;
import applica.framework.security.authorization.AuthorizationService;
import applica.framework.security.authorization.BaseAuthorizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.authentication.encoding.Md5PasswordEncoder;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

/**
 * Created by bimbobruno on 14/11/2016.
 */

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity
@Order(2)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserDetailsService userDetailsService;

    @Bean
    public AuthorizationService authorizationService() {
        return new BaseAuthorizationService();
    }

    @Override
    public void init(WebSecurity web) throws Exception {
        web
                .ignoring()
                .antMatchers(
                        "/**",
                        "/public/**",
                        "/static/**",
                        "/auth/**",
                        "/account/register",
                        "/account/recover",
                        "/account/confirm",
                        "/grids/**",
                        "/forms/**",
                        "/entities/**"
                )
        ;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return new UserService();
    }

    @Bean
    public AuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(new Md5PasswordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(List<AuthenticationProvider> authenticationProviders) {
        ProviderManager manager = new ProviderManager(authenticationProviders);
        return manager;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable();

        http
                .authorizeRequests()
                    .antMatchers("/api").authenticated()
                    .and()
                    .antMatcher("/**").anonymous()
        ;

    }

}
