package applica._APPNAME_.api.configuration;

import applica._APPNAME_.api.facade.AccountFacade;
import applica._APPNAME_.api.permissions.PermissionMap;
import applica._APPNAME_.domain.data.RolesRepository;
import applica._APPNAME_.domain.data.UsersRepository;
import applica._APPNAME_.domain.model.*;
import applica._APPNAME_.services.authorizations.AuthorizationContexts;
import applica.framework.Query;
import applica.framework.data.mongodb.MongoEmbedded;
import applica.framework.data.mongodb.MongoHelper;
import applica.framework.library.options.OptionsManager;
import applica.framework.library.utils.NullableDateConverter;
import applica.framework.library.utils.ProgramException;
import applica.framework.licensing.LicenseManager;
import applica.framework.revision.services.RevisionService;
import applica.framework.security.authorization.Permissions;
import applica.framework.widgets.acl.CrudPermission;
import applica.framework.widgets.acl.CrudSecurityConfigurer;
import org.apache.commons.beanutils.ConvertUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static applica.framework.security.authorization.BaseAuthorizationService.SUPERUSER_PERMISSION;

/**
 * Created by bimbobruno on 22/11/2016.
 */
@Component
public class ApplicationInitializer {

    private static final String DEFAULT_ADMIN_PASSWORD = "applica";
    private static final String DEFAULT_ADMIN_USERNAME = "admin@applica.guru";

    private Log logger = LogFactory.getLog(getClass());

    @Autowired(required = false)
    private MongoEmbedded mongoEmbedded;

    @Autowired(required = false)
    private RevisionService revisionService;

    @Autowired
    private OptionsManager options;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private RolesRepository rolesRepository;

    @Autowired
    private AccountFacade accountFacade;

    public void init() {
        if (revisionService != null)
            revisionService.disableRevisionForCurrentThread();

        LicenseManager.instance().setUser(options.get("applica.framework.licensing.user"));
        LicenseManager.instance().mustBeValid();

        setupRoles();
        setupPermissions();
        initializeCustomPermissions();

        User user = usersRepository.find(Query.build().eq(Filters.USER_MAIL, DEFAULT_ADMIN_USERNAME)).findFirst().orElse(null);
        if (user == null) {
            user = new User();
            String encodedPassword = accountFacade.encryptAndGetPassword(DEFAULT_ADMIN_PASSWORD);
            user.setMail("admin@applica.guru");
            user.setPassword(encodedPassword);
            user.setName("admin");
            user.setActive(true);
            usersRepository.save(user);
        }


        Role role = rolesRepository.find(Query.build().filter(Filters.ROLE_NAME, Role.ADMIN)).findFirst().orElse(null);

        if (role != null) {
            user.setRoles(new ArrayList<>());
            user.getRoles().add(role);
            usersRepository.save(user);
        }

        NullableDateConverter dateConverter = new NullableDateConverter();
        dateConverter.setPatterns(new String[]{"dd/MM/yyyy HH:mm", "MM/dd/yyyy HH:mm", "yyyy-MM-dd HH:mm", "dd/MM/yyyy", "MM/dd/yyyy", "yyyy-MM-dd", "HH:mm"});
        ConvertUtils.register(dateConverter, Date.class);

        logger.info("Applica Framework app started");
        if (revisionService != null)
            revisionService.enableRevisionForCurrentThread();

    }


    private void setupRoles() {

        /*
        Crea i diversi ruoli del sistema, se non sono presenti
        */
        for (String roleDescription : Role.getAllRoles()) {
            Role roleToCreate = rolesRepository.find(Query.build().filter(Filters.ROLE_NAME, roleDescription)).findFirst().orElse(null);
            if (roleToCreate == null) {
                roleToCreate = new Role();
                roleToCreate.setRole(roleDescription);
                roleToCreate.setPermissions(getPermissionByRole(roleDescription));
                rolesRepository.save(roleToCreate);
            }
        }
    }

    private void initializeCustomPermissions() {
        for (String permission : CustomPermissions.getAll()) {
            Permissions.instance().registerStatic(permission);
        }
    }

    private List<String> getPermissionByRole(String roleDescription) {
        switch (roleDescription) {
            case Role.ADMIN:
                return Arrays.asList(CustomPermissions.RESET_USER_PASSWORD, SUPERUSER_PERMISSION);
            default:
                return new ArrayList<>();
        }
    }


    private void setupPermissions() {

        for (String crudEntity : EntityList.getAll()) {
            registerPermissions(crudEntity);
        }

        for (String crudEntity : EntityList.getAll()) {
            configureCrudSecurityConfigurer(crudEntity, PermissionMap.staticPermissions(crudEntity));
        }

        for (String permission : applica._APPNAME_.api.permissions.Permissions.getAllPermissions()) {
            Permissions.instance().registerStatic(permission);
        }

        Permissions.instance().scan(getClass().getPackage(), AuthorizationContexts.class.getPackage());

    }

    private void registerPermissions(String crudEntityName) {
        for (String usersPermission : PermissionMap.staticPermissions(crudEntityName)) {
            Permissions.instance().registerStatic(usersPermission);
        }
    }

    private void configureCrudSecurityConfigurer(String crudEntityName, List<String> crudPermissions) {

        CrudSecurityConfigurer.instance().configure(crudEntityName, CrudPermission.NEW, crudPermissions.stream().filter(c -> c.endsWith("new")).findFirst().get());
        CrudSecurityConfigurer.instance().configure(crudEntityName, CrudPermission.LIST, crudPermissions.stream().filter(c -> c.endsWith("list")).findFirst().get());
        CrudSecurityConfigurer.instance().configure(crudEntityName, CrudPermission.SAVE, crudPermissions.stream().filter(c -> c.endsWith("save")).findFirst().get());
        CrudSecurityConfigurer.instance().configure(crudEntityName, CrudPermission.EDIT, crudPermissions.stream().filter(c -> c.endsWith("edit")).findFirst().get());
        CrudSecurityConfigurer.instance().configure(crudEntityName, CrudPermission.DELETE, crudPermissions.stream().filter(c -> c.endsWith("delete")).findFirst().get());

    }

    public void initializeMongoEmbedded() {
        List<String> dataSources = MongoHelper.getDataSources(options);

        for (String dataSource : dataSources) {
            Boolean embedded = Boolean.parseBoolean(options.get(String.format("applica.framework.data.mongodb.%s.embedded", dataSource)));

            if (embedded != null && embedded) {
                if (mongoEmbedded == null) {
                    throw new ProgramException("MongoEmbedded bean not configured");
                }

                mongoEmbedded.start(dataSource);
            }
        }
    }

}
