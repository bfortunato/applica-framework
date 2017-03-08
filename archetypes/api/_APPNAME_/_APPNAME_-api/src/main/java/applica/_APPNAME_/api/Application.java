package applica._APPNAME_.api;

import applica._APPNAME_.api.configuration.ApplicationConfiguration;
import applica._APPNAME_.api.configuration.ApplicationInitializer;
import applica._APPNAME_.api.configuration.MongoConfiguration;
import applica._APPNAME_.api.configuration.SecurityConfiguration;
import applica._APPNAME_.domain.model.User;
import applica.framework.AEntity;
import applica.framework.widgets.entities.EntitiesRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.PropertyPlaceholderAutoConfiguration;
import org.springframework.boot.autoconfigure.jackson.JacksonAutoConfiguration;
import org.springframework.boot.autoconfigure.web.*;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import javax.annotation.PostConstruct;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 2/21/13
 * Time: 3:37 PM
 */
@EnableWebMvc
@ComponentScan("applica._APPNAME_.domain")
@ComponentScan("applica._APPNAME_.data.mongodb")
@ComponentScan("applica._APPNAME_.data.hibernate")
@ComponentScan("applica._APPNAME_.services")
@ComponentScan("applica._APPNAME_.api")
@Import({
        DispatcherServletAutoConfiguration.class,
        EmbeddedServletContainerAutoConfiguration.class,
        ErrorMvcAutoConfiguration.class,
        HttpEncodingAutoConfiguration.class,
        HttpMessageConvertersAutoConfiguration.class,
        JacksonAutoConfiguration.class,
        ServerPropertiesAutoConfiguration.class,
        PropertyPlaceholderAutoConfiguration.class,
        WebMvcAutoConfiguration.class,
        ApplicationConfiguration.class,
        MongoConfiguration.class,
        SecurityConfiguration.class
})
public class Application {
    static {
        AEntity.strategy = AEntity.IdStrategy.String;
    }

    @Autowired
    private ApplicationInitializer applicationInitializer;

    @PostConstruct
    public void init() {
        applicationInitializer.init();
    }

    public static void main(String[] args) {
        try {
            EntitiesRegistry.instance().init(User.class.getPackage());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        SpringApplication.run(Application.class, args);
    }
}
