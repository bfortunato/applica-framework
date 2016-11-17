package applica._APPNAME_.api;

import applica.framework.AEntity;
import applica.framework.library.options.OptionsManager;
import applica.framework.library.utils.NullableDateConverter;
import applica.framework.licensing.LicenseManager;
import org.apache.commons.beanutils.ConvertUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import java.util.Date;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 2/21/13
 * Time: 3:37 PM
 */
@EnableWebMvc
@ComponentScan("applica._APPNAME_.domain")
@ComponentScan("applica._APPNAME_.data.mongodb")
@ComponentScan("applica._APPNAME_.services")
@ComponentScan("applica._APPNAME_.api")

@EnableAutoConfiguration(exclude={DataSourceAutoConfiguration.class, MongoAutoConfiguration.class})
public class Application {

    static {
        AEntity.strategy = AEntity.IdStrategy.String;
    }

    private Log logger = LogFactory.getLog(getClass());

    @Autowired
    private OptionsManager options;
/*
    @Autowired
    private CrudFactory crudFactory;
*/
    public void init() {
        LicenseManager.instance().setUser(options.get("applica.framework.licensing.user"));
        LicenseManager.instance().mustBeValid();

        logger.info("Applica Framework app started");

        NullableDateConverter dateConverter = new NullableDateConverter();
        dateConverter.setPatterns(new String[] { "dd/MM/yyyy HH:mm", "MM/dd/yyyy HH:mm", "yyyy-MM-dd HH:mm", "dd/MM/yyyy", "MM/dd/yyyy", "yyyy-MM-dd", "HH:mm" });
        ConvertUtils.register(dateConverter, Date.class);

        /*CrudConfiguration.instance().setCrudFactory(crudFactory);

        Package pack = Application.class.getPackage();
        try {
            CrudConfiguration.instance().scan(pack);
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("Error scanning crud configuration: " + e.getMessage());
        }

        CrudConfiguration.instance().registerGridRenderer(CrudConstants.DEFAULT_ENTITY_TYPE, DefaultGridRenderer.class);
        CrudConfiguration.instance().registerFormRenderer(CrudConstants.DEFAULT_ENTITY_TYPE, DefaultFormRenderer.class);
        CrudConfiguration.instance().registerFormFieldRenderer(CrudConstants.DEFAULT_ENTITY_TYPE, "", DefaultFieldRenderer.class);
        CrudConfiguration.instance().registerFormProcessor(CrudConstants.DEFAULT_ENTITY_TYPE, DefaultFormProcessor.class);
        CrudConfiguration.instance().registerCellRenderer(CrudConstants.DEFAULT_ENTITY_TYPE, "", DefaultCellRenderer.class);

        CrudConfiguration.instance().setParam(CrudConfiguration.DEFAULT_ENTITY_TYPE, Grid.PARAM_ROWS_PER_PAGE, "20");

        registerGrids();
        registerForms();
        configureCrudSecurity();
        */
    }
/*
    private void configureCrudSecurity() {
        Permissions.instance().registerStatic("users:new");
        Permissions.instance().registerStatic("users:list");
        Permissions.instance().registerStatic("users:save");
        Permissions.instance().registerStatic("users:edit");
        Permissions.instance().registerStatic("users:delete");

        CrudSecurityConfigurer.instance().configure("user", CrudPermission.NEW, "users:new");
        CrudSecurityConfigurer.instance().configure("user", CrudPermission.LIST, "users:list");
        CrudSecurityConfigurer.instance().configure("user", CrudPermission.SAVE, "users:save");
        CrudSecurityConfigurer.instance().configure("user", CrudPermission.EDIT, "users:edit");
        CrudSecurityConfigurer.instance().configure("user", CrudPermission.DELETE, "users:delete");

        Permissions.instance().registerStatic("roles:new");
        Permissions.instance().registerStatic("roles:list");
        Permissions.instance().registerStatic("roles:save");
        Permissions.instance().registerStatic("roles:edit");
        Permissions.instance().registerStatic("roles:delete");

        CrudSecurityConfigurer.instance().configure("role", CrudPermission.NEW, "roles:new");
        CrudSecurityConfigurer.instance().configure("role", CrudPermission.LIST, "roles:list");
        CrudSecurityConfigurer.instance().configure("role", CrudPermission.SAVE, "roles:save");
        CrudSecurityConfigurer.instance().configure("role", CrudPermission.EDIT, "roles:edit");
        CrudSecurityConfigurer.instance().configure("role", CrudPermission.DELETE, "roles:delete");
    }

    private void registerForms() {
        FormConfigurator.configure(User.class, "user")
                .repository(UsersRepositoryWrapper.class)
                .tab("label.user_info")
                .fieldSet("label.account")
                .field("mail", "label.mail", MailFieldRenderer.class).param("mail", Params.PLACEHOLDER, "mail@example.com")
                .field("password", "label.password", PasswordFieldRenderer.class).param("password", Params.PLACEHOLDER, "msg.leave_blank_password")
                .field("active", "label.active")
                .fieldSet("label.profile")
                .field("registrationDate", "label.registration_date", DatePickerRenderer.class)
                .field("image", "label.image", UserImageFieldRenderer.class)
                .fieldSet("label.roles")
                .field("roles", null, RolesFieldRenderer.class);

        FormConfigurator.configure(Role.class, "role")
                .repository(RolesRepository.class)
                .field("role", "label.name")
                .field("permissions", "label.permissions", PermissionsFieldRenderer.class);
    }

    private void registerGrids() {
        GridConfigurator.configure(User.class, "user")
                .repository(UsersRepository.class)
                .searchForm(MailSearchForm.class)
                .column("mail", "label.mail", true)
                .column("active", "label.active", false);

        GridConfigurator.configure(Role.class, "role")
                .repository(RolesRepository.class)
                .searchForm(RoleSearchForm.class)
                .column("role", "label.name", true);

    }
*/
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
