package applica.framework.library.velocity;

import applica.framework.library.utils.ProgramException;
import org.apache.commons.io.IOUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.velocity.app.VelocityEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.WebApplicationContext;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 2/22/13
 * Time: 8:44 AM
 */
public class BaseVelocityBuilder implements VelocityBuilder {
    private VelocityEngine engine;

    private Log logger = LogFactory.getLog(getClass());

    @Autowired
    private WebApplicationContext webApplicationContext;

    public VelocityEngine engine() {
        if(engine == null) {
            engine = new VelocityEngine();

            Properties properties = new Properties();
            InputStream in = null;
            try {
                in = webApplicationContext.getServletContext().getResourceAsStream("/WEB-INF/velocity.properties");
                properties.load(in);
                engine.init(properties);
            } catch (IOException e) {
                e.printStackTrace();
                logger.error("Error loading velocity engine properties");
                throw new ProgramException("Cannot load velocity engine properties");
            }

            IOUtils.closeQuietly(in);
        }

        return engine;
    }
}
