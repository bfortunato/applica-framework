package applica._APPNAME_.api.configuration;

import applica.framework.library.options.OptionsManager;
import applica.framework.library.utils.NullableDateConverter;
import applica.framework.licensing.LicenseManager;
import org.apache.commons.beanutils.ConvertUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Date;

/**
 * Created by bimbobruno on 22/11/2016.
 */
@Component
public class ApplicationInitializer {

    private Log logger = LogFactory.getLog(getClass());

    @Autowired
    private OptionsManager options;

    public void init() {
        LicenseManager.instance().setUser(options.get("applica.framework.licensing.user"));
        LicenseManager.instance().mustBeValid();

        NullableDateConverter dateConverter = new NullableDateConverter();
        dateConverter.setPatterns(new String[] { "dd/MM/yyyy HH:mm", "MM/dd/yyyy HH:mm", "yyyy-MM-dd HH:mm", "dd/MM/yyyy", "MM/dd/yyyy", "yyyy-MM-dd", "HH:mm" });
        ConvertUtils.register(dateConverter, Date.class);

        logger.info("Applica Framework app started");
    }

}
