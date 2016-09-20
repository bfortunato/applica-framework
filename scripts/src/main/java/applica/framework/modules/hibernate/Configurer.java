package applica.framework.modules.hibernate;

import applica.framework.Entity;
import applica.framework.library.options.OptionsManager;
import org.springframework.util.Assert;

import java.util.ArrayList;
import java.util.List;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 09/10/14
 * Time: 10:25
 */
public class Configurer extends XmlBuilder {

    private List<Class<? extends Entity>> entities = new ArrayList<>();
    private OptionsManager options;
    private String dataSource;

    public List<Class<? extends Entity>> getEntities() {
        return entities;
    }

    public void setEntities(List<Class<? extends Entity>> entities) {
        this.entities = entities;
    }

    public OptionsManager getOptions() {
        return options;
    }

    public void setOptions(OptionsManager options) {
        this.options = options;
    }

    public String configure() {
        Assert.notNull(dataSource, "Cannot configure. DataSource not setted.");

        xml = new StringBuilder();

        raw("<?xml version=\"1.0\" encoding=\"utf-8\"?>"); endl();
        raw("<!DOCTYPE hibernate-configuration PUBLIC \"-//Hibernate/Hibernate Configuration DTD 3.0//EN\" \"http://www.hibernate.org/dtd/hibernate-configuration-3.0.dtd\">"); endl();
        open("hibernate-configuration"); endl();

                open("session-factory"); endl();

                raw("<!-- Database connection settings -->"); endl();
                open("property", attr("name", "connection.driver_class")); rawNoIndent(options.get(String.format("applica.framework.data.hibernate.%s.connection.driver_class", dataSource))); closeNoIndent("property"); endl();
                open("property", attr("name", "connection.url")); rawNoIndent(options.get(String.format("applica.framework.data.hibernate.%s.connection.url", dataSource))); closeNoIndent("property");  endl();
                open("property", attr("name", "connection.username")); rawNoIndent(options.get(String.format("applica.framework.data.hibernate.%s.connection.username", dataSource))); closeNoIndent("property");  endl();
                open("property", attr("name", "connection.password")); rawNoIndent(options.get(String.format("applica.framework.data.hibernate.%s.connection.password", dataSource))); closeNoIndent("property");  endl();

                raw("<!-- C3P0 pool connection settings -->"); endl();
                open("property", attr("name", "hibernate.c3p0.acquire_increment")); rawNoIndent(options.get(String.format("applica.framework.data.hibernate.%s.c3p0.acquire_increment", dataSource))); closeNoIndent("property");  endl();
                open("property", attr("name", "hibernate.c3p0.idle_test_period")); rawNoIndent(options.get(String.format("applica.framework.data.hibernate.%s.c3p0.idle_test_period", dataSource))); closeNoIndent("property");  endl();
                open("property", attr("name", "hibernate.c3p0.timeout")); rawNoIndent(options.get(String.format("applica.framework.data.hibernate.%s.c3p0.timeout", dataSource))); closeNoIndent("property");  endl();
                open("property", attr("name", "hibernate.c3p0.max_size")); rawNoIndent(options.get(String.format("applica.framework.data.hibernate.%s.c3p0.max_size", dataSource))); closeNoIndent("property");  endl();
                open("property", attr("name", "hibernate.c3p0.max_statements")); rawNoIndent(options.get(String.format("applica.framework.data.hibernate.%s.c3p0.max_statements", dataSource))); closeNoIndent("property");  endl();
                open("property", attr("name", "hibernate.c3p0.min_size")); rawNoIndent(options.get(String.format("applica.framework.data.hibernate.%s.c3p0.min_size", dataSource))); closeNoIndent("property");  endl();
                open("property", attr("name", "hibernate.c3p0.acquireRetryAttempts")); rawNoIndent(options.get(String.format("applica.framework.data.hibernate.%s.c3p0.acquireRetryAttempts", dataSource))); closeNoIndent("property");  endl();
                open("property", attr("name", "hibernate.c3p0.acquireRetryDelay")); rawNoIndent(options.get(String.format("applica.framework.data.hibernate.%s.c3p0.acquireRetryDelay", dataSource))); closeNoIndent("property");  endl();

                endl();

                raw("<!-- SQL dialect -->"); endl();
                open("property", attr("name", "dialect")); rawNoIndent(options.get(String.format("applica.framework.data.hibernate.%s.dialect", dataSource))); closeNoIndent("property");  endl();
                endl();

                raw("<!-- Enable Hibernate's automatic session context management -->"); endl();
                open("property", attr("name", "current_session_context_class")); rawNoIndent("thread"); closeNoIndent("property");  endl();
                endl();

                raw("<!-- Echo all executed SQL to stdout -->"); endl();
                open("property", attr("name", "show_sql")); rawNoIndent("false"); closeNoIndent("property");  endl();
                endl();

                raw("<!-- Drop and re-create the database schema on startup -->"); endl();
                open("property", attr("name", "hbm2ddl.auto")); rawNoIndent("update"); closeNoIndent("property");  endl();
                endl();

                raw("<!-- Mapped classes -->"); endl();
                entities.forEach(e -> { openClose("mapping",attr("resource", classToHbm(e.getName()))); endl(); });

            close("session-factory"); endl();

        close("hibernate-configuration"); endl();
        return xml.toString();
    }

    private String classToHbm(String name) {
        return String.format("%s.hbm.xml", name.replace(".", "/"));
    }

    public void setDataSource(String dataSource) {
        this.dataSource = dataSource;
    }

    public String getDataSource() {
        return dataSource;
    }
}
