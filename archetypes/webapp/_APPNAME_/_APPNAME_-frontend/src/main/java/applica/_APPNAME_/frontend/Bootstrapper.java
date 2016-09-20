package applica._APPNAME_.frontend;

import applica.framework.AEntity;
import applica.framework.library.options.OptionsManager;
import applica.framework.licensing.LicenseManager;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Applica (www.applica.guru)
 * User: Bruno Fortunato
 * Date: 3/19/13
 * Time: 6:45 PM
 */
public class Bootstrapper {

    static {
        AEntity.strategy = AEntity.IdStrategy.String;
    }

    @Autowired
    private OptionsManager options;

    private Log logger = LogFactory.getLog(getClass());

    public void init() {
        LicenseManager.instance().setUser(options.get("applica.framework.licensing.user"));
        LicenseManager.instance().mustBeValid();

        logger.info("Applica _APPNAME_ started");
    }

}
