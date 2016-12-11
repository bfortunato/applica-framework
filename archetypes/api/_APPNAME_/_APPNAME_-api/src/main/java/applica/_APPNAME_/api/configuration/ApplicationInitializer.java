package applica._APPNAME_.api.configuration;

import applica._APPNAME_.domain.data.UsersRepository;
import applica._APPNAME_.domain.model.User;
import applica.framework.data.mongodb.MongoEmbedded;
import applica.framework.data.mongodb.MongoHelper;
import applica.framework.library.options.OptionsManager;
import applica.framework.library.utils.NullableDateConverter;
import applica.framework.library.utils.ProgramException;
import applica.framework.licensing.LicenseManager;
import org.apache.commons.beanutils.ConvertUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

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

    public void init() {
        LicenseManager.instance().setUser(options.get("applica.framework.licensing.user"));
        LicenseManager.instance().mustBeValid();

        initializeMongoEmbedded();

        NullableDateConverter dateConverter = new NullableDateConverter();
        dateConverter.setPatterns(new String[] { "dd/MM/yyyy HH:mm", "MM/dd/yyyy HH:mm", "yyyy-MM-dd HH:mm", "dd/MM/yyyy", "MM/dd/yyyy", "yyyy-MM-dd", "HH:mm" });
        ConvertUtils.register(dateConverter, Date.class);

        try {
            if (Boolean.parseBoolean(options.get("applica.framework.data.mongodb.default.embedded"))) {
                createMockUsers();
            }
        } catch (Exception e) {}

        logger.info("Applica Framework app started");
    }

    private void createMockUsers() {
        for (int i = 0; i < 100; i++) {
            User user = new User();
            user.setName(String.format("Name Surname %d", i));
            user.setMail(String.format("mail%d@applica.guru", i));
            user.setPassword(String.format("%d", i));
            user.setActive(i % 2 == 0);

            usersRepository.save(user);

            logger.info("Created mock user: " + user.getMail());
        }
    }

    public void initializeMongoEmbedded() {
        List<String> dataSources = MongoHelper.getDataSources(options);
        List<String> startedInstances = new ArrayList<>();

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
