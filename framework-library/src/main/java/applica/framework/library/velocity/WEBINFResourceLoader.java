package applica.framework.library.velocity;

import applica.framework.ApplicationContextProvider;
import org.apache.commons.collections.ExtendedProperties;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.velocity.runtime.resource.loader.FileResourceLoader;
import org.springframework.web.context.WebApplicationContext;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 26/10/13
 * Time: 11:13
 */
public class WEBINFResourceLoader extends FileResourceLoader {

    private Log logger = LogFactory.getLog(getClass());

    @Override
    public void init(ExtendedProperties configuration) {
        WebApplicationContext context = (WebApplicationContext) ApplicationContextProvider.provide();
        String path = context.getServletContext().getRealPath("/WEB-INF/");

        configuration.addProperty("path", path);

        logger.info(String.format("WEBINF resource loader path: %s", path));

        super.init(configuration);
    }
}
