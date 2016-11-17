package applica._APPNAME_.api.configuration;

import applica._APPNAME_.data.mongodb.UserDetailsMongoRepository;
import applica.framework.CrudStrategy;
import applica.framework.DefaultRepository;
import applica.framework.data.mongodb.DefaultMongoRepository;
import applica.framework.data.mongodb.MongoCrudStrategy;
import applica.framework.data.mongodb.MongoHelper;
import applica.framework.data.mongodb.MongoMapper;
import applica.framework.data.mongodb.constraints.ConstraintsChecker;
import applica.framework.data.mongodb.constraints.SimpleConstraintsChecker;
import applica.framework.security.UserDetailsRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

/**
 * Created by bimbobruno on 14/11/2016.
 */
@Configuration
@Order(4)
public class MongoConfiguration {

    @Bean
    public MongoHelper mongoHelper() {
        return new MongoHelper();
    }

    @Bean
    public MongoMapper mongoMapper() {
        return new MongoMapper();
    }

    @Bean
    public CrudStrategy crudStrategy() {
        return new MongoCrudStrategy();
    }

    @Bean
    public ConstraintsChecker constraintsChecker() {
        return new SimpleConstraintsChecker();
    }

    @Bean(name = "default-repository")
    public DefaultRepository defaultRepository() {
        return new DefaultMongoRepository();
    }

}
