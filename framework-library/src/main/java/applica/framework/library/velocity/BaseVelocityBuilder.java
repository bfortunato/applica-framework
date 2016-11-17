package applica.framework.library.velocity;

import applica.framework.library.utils.ProgramException;
import org.apache.commons.io.IOUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.velocity.app.VelocityEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 11/17/2016
 * Time: 11:14 AM
 */
public class BaseVelocityBuilder implements VelocityBuilder {
    private VelocityEngine engine;

    private Log logger = LogFactory.getLog(getClass());

    @Autowired
    private ApplicationContext context;

    public VelocityEngine engine() {
        if(engine == null) {
            engine = new VelocityEngine();

            Properties properties = new Properties();
            InputStream in = null;
            try {
                Resource resource = context.getResource("classpath:/config/velocity.properties");
                in = resource.getInputStream();
                properties.load(in);
                engine.init(properties);
            } catch (IOException e) {
                e.printStackTrace();
                logger.error("Error loading velocity engine properties");
                throw new ProgramException("Cannot load velocity engine properties");
            } finally {
                IOUtils.closeQuietly(in);
            }
        }

        return engine;
    }
}
