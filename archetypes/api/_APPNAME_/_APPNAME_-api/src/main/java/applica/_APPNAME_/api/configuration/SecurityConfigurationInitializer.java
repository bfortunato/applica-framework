package applica._APPNAME_.api.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.context.AbstractSecurityWebApplicationInitializer;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

/**
 * Created by bimbobruno on 17/11/2016.
 */
@Configuration
public class SecurityConfigurationInitializer extends WebSecurityConfigurerAdapter {
}
