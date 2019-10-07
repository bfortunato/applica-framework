package applica.framework;

import applica.framework.cli.CommandLineParser;
import applica.framework.cli.Modules;
import org.springframework.util.StringUtils;

public class Applica {

    public static final String VERSION = "2.3.0";
    public static final String FRAMEWORK_ARCHETYPES_REPOSITORY_URL = "https://github.com/bfortunato/applica-framework-archetype-{archetype}.git";

    public static String javaHome = null;

    public static void main(String[] args) {
        javaHome = System.getenv("JAVA_HOME");
        if (!StringUtils.hasLength(javaHome)) {
            System.err.println("Please set JAVA_HOME environment variable");
            System.exit(1);
            return;
        }

        Modules.instance().scan(Applica.class.getPackage());

        CommandLineParser parser = new CommandLineParser();
        try {
            parser.parse(args);

            if (parser.getCommand().equals("version")) {
                System.out.println("Applica Framework version " + VERSION);
            } else if (parser.getCommand().equals("help")) {
                printUsage();
            } else {
                Modules.instance().call(parser.getCommand(), parser.getProperties());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void printUsage() {
        StringBuilder usage = new StringBuilder();
        usage.append("Usage: applica module:action [properties...]\n");
        usage.append("\t\t\t(to execute a module action)\n");
        usage.append("specify properties with\n");
        usage.append("\t-D<name>=<value>\n\t\t\t\tSpecify parameters for action\n");
        usage.append("where vailable modules are\n");
        usage.append("\thelp\n\t\t\t\tShow this help\n");
        usage.append("\tversion\n\t\t\t\tDisplay framework version\n");
        Modules.instance().getModules().forEach( m -> {
            usage.append(String.format("\t%s\n", m.getModule()));
            m.getMethods().forEach(a -> usage.append(String.format("\t\t\t\t:%s -> %s\n", a.getAction(), a.getDescription())));
        });
        usage.append("\nExample:\n");
        usage.append("\tapplica project:create -Dname=myproject -Darchetype=data-mongo\n");
        usage.append("\t\t\t\tCreates a new project called myproject with archetype webapp-mongo\n");
        System.out.println(usage.toString());
    }

}
