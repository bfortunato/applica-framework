package applica._APPNAME_.api;

import applica._APPNAME_.api.configuration.ApplicationConfiguration;
import applica._APPNAME_.api.configuration.ApplicationInitializer;
import applica._APPNAME_.api.configuration.MongoConfiguration;
import applica._APPNAME_.api.configuration.SecurityConfiguration;
import applica._APPNAME_.domain.model.User;
import applica.framework.AEntity;
import applica.framework.entities.EntitiesRegistry;
import applica.framework.library.options.OptionsManager;
import applica.framework.library.options.PropertiesOptionManager;
import applica.framework.library.utils.NullableDateConverter;
import applica.framework.licensing.LicenseManager;
import org.apache.commons.beanutils.ConvertUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;
import org.springframework.boot.autoconfigure.mongo.embedded.EmbeddedMongoAutoConfiguration;
import org.springframework.boot.autoconfigure.thymeleaf.ThymeleafAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import javax.annotation.PostConstruct;
import java.util.Date;

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
@EnableAutoConfiguration(exclude={
        DataSourceAutoConfiguration.class,
        MongoAutoConfiguration.class,
        EmbeddedMongoAutoConfiguration.class,
        ThymeleafAutoConfiguration.class,

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
            EntitiesRegistry.instance().addPackage(User.class.getPackage());
            EntitiesRegistry.instance().init();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        SpringApplication.run(Application.class, args);
    }
}
