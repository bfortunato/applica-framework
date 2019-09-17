package applica.framework;

import applica.framework.modules.CommandLineParser;
import applica.framework.modules.HibernateModule;
import applica.framework.modules.Modules;
import applica.framework.modules.ProjectModule;
import org.springframework.util.StringUtils;

import java.util.Properties;

public class Applica {

    public static final String VERSION = "2.1.4-RELEASE";

    public static String frameworkHome = null;
    public static String javaHome = null;
    public static String mavenHome = null;

    public static void main(String[] args) {
        frameworkHome = "/Users/antoniolovicario/Progetti/applica_framework_2_1_4/";
        ProjectModule module = new ProjectModule();
        Properties p = new Properties();
        p.setProperty("name", "jira_ticket_AAA");
        p.setProperty("archetype", "client");
        module.create(p);

//        if (!StringUtils.hasLength(frameworkHome)) {
//            System.err.println("Please set APPLICAFRAMEWORK_HOME environment variable");
//            System.exit(1);
//            return;
//        }
//
//        javaHome = System.getenv("JAVA_HOME");
//        if (!StringUtils.hasLength(frameworkHome)) {
//            System.err.println("Please set JAVA_HOME environment variable");
//            System.exit(1);
//            return;
//        }
//
//        mavenHome = System.getenv("M2_HOME");
//        if (!StringUtils.hasLength(mavenHome)) {
//            System.err.println("Please set M2_HOME environment variable");
//            System.exit(1);
//            return;
//        }
//
//        Modules.instance().scan();
//
//        CommandLineParser parser = new CommandLineParser();
//        try {
//            parser.parse(args);
//
//            if (parser.getCommand().equals("version")) {
//                System.out.println("Applica Framework version " + VERSION);
//            } else if (parser.getCommand().equals("help")) {
//                printUsage();
//            } else {
//                Modules.instance().call(parser.getCommand(), parser.getProperties());
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
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
