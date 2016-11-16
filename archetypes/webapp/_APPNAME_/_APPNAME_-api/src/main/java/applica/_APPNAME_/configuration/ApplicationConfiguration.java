package applica._APPNAME_.configuration;

import applica.framework.ApplicationContextProvider;
import applica.framework.DefaultRepositoriesFactory;
import applica.framework.RepositoriesFactory;
import applica.framework.fileserver.servlets.FilesServlet;
import applica.framework.fileserver.servlets.ImagesServlet;
import applica.framework.library.cache.Cache;
import applica.framework.library.cache.MemoryCache;
import applica.framework.library.options.OptionsManager;
import applica.framework.library.options.PropertiesOptionManager;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.web.servlet.DispatcherServlet;

/**
 * Created by bimbobruno on 14/11/2016.
 */
@Configuration
public class ApplicationConfiguration extends WebSecurityConfigurerAdapter {

    // FRAMEWORK GENERAL BEANS

    @Bean
    public ApplicationContextProvider applicationContextProvider() {
        return new ApplicationContextProvider();
    }

    @Bean
    public Cache cache() {
        return new MemoryCache();
    }

    @Bean
    public OptionsManager optionsManager() {
        return new PropertiesOptionManager();
    }

    @Bean
    public RepositoriesFactory repositoriesFactory() {
        return new DefaultRepositoriesFactory();
    }

    /* File Server servlets */

    @Bean
    public ServletRegistrationBean filesServletRegistration() {
        return new ServletRegistrationBean(new FilesServlet(), "/files/**");
    }

    @Bean
    public ServletRegistrationBean imagesServletRegistration() {
        return new ServletRegistrationBean(new ImagesServlet(), "/images/**");
    }
}
