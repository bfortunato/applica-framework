package applica.framework.data.mongodb;

import applica.framework.library.options.OptionsManager;
import de.flapdoodle.embed.mongo.MongodExecutable;
import de.flapdoodle.embed.mongo.MongodProcess;
import de.flapdoodle.embed.mongo.MongodStarter;
import de.flapdoodle.embed.mongo.config.MongodConfig;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.process.distribution.GenericVersion;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.util.Objects;

/**
 * Created by bimbobruno on 22/11/2016.
 */
public class MongoEmbedded {

    private Log logger = LogFactory.getLog(getClass());

    @Autowired
    private OptionsManager options;

    public void start(final String dataSource) {
        String host = options.get(String.format("applica.framework.data.mongodb.%s.host", dataSource));
        Integer port = Integer.parseInt(options.get(String.format("applica.framework.data.mongodb.%s.port", dataSource)));
        Objects.requireNonNull(port, "Please specify mongo embedded port for data source " + dataSource);
        String dbName = options.get(String.format("applica.framework.data.mongodb.%s.db", dataSource));

        MongodConfig config = new MongodConfig(new GenericVersion("3.2.11"), port, false);
        MongodStarter runtime = MongodStarter.getDefaultInstance();
        MongodExecutable executable = null;

        try {
            executable = runtime.prepare(config);
            MongodProcess process = executable.start();

            logger.info(String.format("MongoEmbedded instance started at port %d", port));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}
