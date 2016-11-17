package applica._APPNAME_.api.configuration;

import applica.framework.ApplicationContextProvider;
import applica.framework.DefaultRepositoriesFactory;
import applica.framework.RepositoriesFactory;
import applica.framework.fileserver.servlets.FilesServlet;
import applica.framework.fileserver.servlets.ImagesServlet;
import applica.framework.library.cache.Cache;
import applica.framework.library.cache.MemoryCache;
import applica.framework.library.options.OptionsManager;
import applica.framework.library.options.PropertiesOptionManager;
import applica.framework.library.velocity.BaseVelocityBuilder;
import applica.framework.library.velocity.VelocityBuilder;
import applica.framework.library.velocity.VelocityBuilderProvider;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * Created by bimbobruno on 14/11/2016.
 */
@Configuration
@Order(1)
public class ApplicationConfiguration extends WebMvcConfigurerAdapter {

    private Log logger = LogFactory.getLog(getClass());

    @Autowired
    private OptionsManager options;

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

    @Bean
    public VelocityBuilder velocityBuilder() {
        return new BaseVelocityBuilder();
    }

    @Bean
    public VelocityBuilderProvider velocityBuilderProvider() {
        return new VelocityBuilderProvider();
    }

    /* cors configuration */

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        String origins = options.get("applica.security.cors.allowedOrigins");
        for (String origin : origins.split(",")) {
            registry.addMapping(origin);

            logger.info(String.format("Added corse origin: %s", origin));
        }

        super.addCorsMappings(registry);
    }
}
