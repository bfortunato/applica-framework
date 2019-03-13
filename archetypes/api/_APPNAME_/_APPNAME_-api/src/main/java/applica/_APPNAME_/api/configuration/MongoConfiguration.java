package applica._APPNAME_.api.configuration;

import applica.framework.CrudStrategy;
import applica.framework.DefaultRepository;
import applica.framework.data.mongodb.*;
import applica.framework.data.mongodb.constraints.ConstraintsChecker;
import applica.framework.data.mongodb.constraints.SimpleConstraintsChecker;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

/**
 * Created by bimbobruno on 14/11/2016.
 */
@Configuration
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
    @Scope("prototype")
    public DefaultRepository defaultRepository() {
        return new DefaultMongoRepository();
    }

}
