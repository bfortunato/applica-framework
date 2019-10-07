package applica.framework.cli;

import org.apache.commons.lang.StringUtils;

import java.text.ParseException;
import java.util.Arrays;
import java.util.Properties;
import java.util.concurrent.atomic.AtomicReference;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 08/10/14
 * Time: 17:54
 */
public class CommandLineParser {

    private String command;
    private Properties properties;

    public void parse(String[] args) throws ParseException {
        if (args.length < 1) {
            throw new ParseException("bad applica call", 0);
        }

        properties = new Properties();
        command = args[0];

        var key = new AtomicReference<String>();

        Arrays.asList(args)
                .stream()
                .skip(1)
                .forEach(p -> {
                    if (p.startsWith("--")) {
                        //there is a previous key, so it's boolean
                        if (StringUtils.isNotEmpty(key.get())) {
                            properties.putIfAbsent(key.get(), true);
                        }
                        key.set(p.substring(2));
                    } else {
                        if (StringUtils.isNotEmpty(key.get())) {
                            properties.put(key.get(), p);
                            key.set(null);
                        }
                     }
                });
    }

    public String getCommand() {
        return command;
    }

    public void setCommand(String command) {
        this.command = command;
    }

    public Properties getProperties() {
        return properties;
    }

    public void setProperties(Properties properties) {
        this.properties = properties;
    }
}
