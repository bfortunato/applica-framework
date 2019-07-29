package applica._APPNAME_.api.configuration;

import applica._APPNAME_.api.localization.LocalizationFilter;
import applica.framework.ApplicationContextProvider;
import applica.framework.library.options.OptionsManager;
import applica.framework.security.Security;
import applica.framework.security.UserDetailsRepository;
import applica.framework.security.UserService;
import applica.framework.security.authorization.AuthorizationService;
import applica.framework.security.authorization.BaseAuthorizationService;
import applica.framework.security.token.TokenAuthenticationFilter;
import applica.framework.security.token.TokenAuthenticationProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import java.util.List;

/**
 * Created by bimbobruno on 14/11/2016.
 */

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserDetailsService userDetailsService;

    @Bean
    public AuthorizationService authorizationService() {
        return new BaseAuthorizationService();
    }

    @Override
    public void init(WebSecurity web) throws Exception {
        web.ignoring()
                .antMatchers("/auth/**")
                .antMatchers("/account/**")
                .antMatchers("/images/**")
                .antMatchers("/services/**")
                .antMatchers( "/system/**")
                .antMatchers("/files/**");
        super.init(web);
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return new UserService();
    }

    @Bean
    public AuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(new BCryptPasswordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationProvider tokenAuthenticationProvider() {
        return new TokenAuthenticationProvider();
    }

    @Bean
    public AuthenticationManager authenticationManager(List<AuthenticationProvider> authenticationProviders) {
        ProviderManager manager = new ProviderManager(authenticationProviders);
        return manager;
    }

    @Bean
    public TokenAuthenticationFilter tokenAuthenticationFilter() {
        TokenAuthenticationFilter filter = new TokenAuthenticationFilter();
        return filter;
    }

    @Bean
    public LocalizationFilter localizationFiler() {
        return new LocalizationFilter();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) {
        auth.authenticationProvider(tokenAuthenticationProvider());
        auth.authenticationProvider(daoAuthenticationProvider());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        //Le API sono stateless e non esiste nessun cookie di sessione (SessionCreationPolicy.STATELESS) quindi il csrf può essere disabilitato
        http
                .csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                    .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                    .antMatchers("/**").authenticated()
                .and()
                .addFilterAfter(tokenAuthenticationFilter(), BasicAuthenticationFilter.class)
        ;

    }

}
