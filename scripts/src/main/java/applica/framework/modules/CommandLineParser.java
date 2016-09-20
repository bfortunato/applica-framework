package applica.framework.modules;

import java.text.ParseException;
import java.util.Arrays;
import java.util.Properties;

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

        Arrays.asList(args)
                .stream()
                .skip(1)
                .filter(p -> p.startsWith("-D") && p.contains("="))
                .forEach(p -> {
                    String pair = p.substring(2);
                    String[] split = pair.split("=");
                    properties.putIfAbsent(split[0].toLowerCase(), split[1]);
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
