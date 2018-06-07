package applica.integrator;


import applica.framework.AEntity;
import applica.framework.EntitiesScanner;
import applica.framework.widgets.entities.EntitiesRegistry;
import applica.integrator.configuration.ApplicationConfiguration;
import applica.integrator.configuration.ApplicationInitializer;
import applica.integrator.configuration.MongoConfiguration;
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
@ComponentScan("applica.integrator")
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
        MongoConfiguration.class
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
            EntitiesScanner scanner = new EntitiesScanner();
            scanner.addHandler(EntitiesRegistry.instance());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        SpringApplication.run(Application.class, args);
    }
}
