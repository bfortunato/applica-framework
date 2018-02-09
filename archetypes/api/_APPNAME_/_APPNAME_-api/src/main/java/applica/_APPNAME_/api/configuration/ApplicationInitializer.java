package applica._APPNAME_.api.configuration;

import applica._APPNAME_.api.permissions.PermissionMap;
import applica._APPNAME_.domain.data.RolesRepository;
import applica._APPNAME_.domain.data.UsersRepository;
import applica._APPNAME_.domain.model.EntityList;
import applica._APPNAME_.domain.model.Filters;
import applica._APPNAME_.domain.model.Role;
import applica._APPNAME_.domain.model.User;
import applica._APPNAME_.services.authorizations.AuthorizationContexts;
import applica.framework.Query;
import applica.framework.data.mongodb.MongoEmbedded;
import applica.framework.data.mongodb.MongoHelper;
import applica.framework.library.options.OptionsManager;
import applica.framework.library.utils.NullableDateConverter;
import applica.framework.library.utils.ProgramException;
import applica.framework.licensing.LicenseManager;
import applica.framework.security.Security;
import applica.framework.security.authorization.Permissions;
import applica.framework.widgets.acl.CrudPermission;
import applica.framework.widgets.acl.CrudSecurityConfigurer;
import org.apache.commons.beanutils.ConvertUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.encoding.Md5PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.*;

/**
 * Created by bimbobruno on 22/11/2016.
 */
@Component
public class ApplicationInitializer {

    private Log logger = LogFactory.getLog(getClass());

    @Autowired(required = false)
    private MongoEmbedded mongoEmbedded;

    @Autowired
    private OptionsManager options;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private RolesRepository rolesRepository;

    public void init() {
        LicenseManager.instance().setUser(options.get("applica.framework.licensing.user"));
        LicenseManager.instance().mustBeValid();

        setupRoles();
        setupPermissions();

        User user = usersRepository.find(Query.build().eq(Filters.USER_MAIL, "admin@applica.guru")).findFirst().orElse(null);
        if (user == null) {
            user = new User();
            String encodedPassword = new Md5PasswordEncoder().encodePassword("applica", null);
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
                rolesRepository.save(roleToCreate);
            }
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

        rolesRepository.find(null).getRows().forEach(role -> {

            //elimino i permessi precedentemente assegnati al ruolo
            role.setPermissions(new ArrayList<>());
            rolesRepository.save(role);

            role.getPermissions().addAll(applica._APPNAME_.api.permissions.Permissions.getPermissionByRole(role.getRole()));

            for (String entity : EntityList.getPermittedEntitiesByRole(role.getRole())) {
                role.getPermissions().addAll(PermissionMap.staticPermissions(entity));
            }

            //           switch (role.getRole()) {
            //               //setta per ogni ruolo, tutte le azioni che può compiere su ogni entità
//                case Role.USER:
//                    role.getPermissions().addAll(PermissionMap.getPartialPermissions(applica._APPNAME_.api.permissions.Permissions.USER, Arrays.asList(PermissionMap.OPERATION_EDIT, PermissionMap.OPERATION_LIST)));
//                    break;
            //           }

            rolesRepository.save(role);

        });

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
