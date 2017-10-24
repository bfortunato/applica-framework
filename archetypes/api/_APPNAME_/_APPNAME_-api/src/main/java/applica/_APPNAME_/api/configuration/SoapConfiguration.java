package applica._APPNAME_.api.configuration;

import applica._APPNAME_.api.soap.UsersSoapService;
import org.apache.cxf.Bus;
import org.apache.cxf.jaxws.EndpointImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.xml.ws.Endpoint;

/**
 * Created by bimbobruno on 10/24/17.
 */
@Configuration
public class SoapConfiguration {

    @Autowired
    private Bus bus;

    @Bean
    public UsersSoapService usersSoapService() {
        return new UsersSoapService();
    }

    @Bean
    public Endpoint usersSoapEndpoint() {
        EndpointImpl endpoint = new EndpointImpl(bus, usersSoapService());
        endpoint.publish("/users");

        return endpoint;
    }

}
